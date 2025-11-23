import logging
from threading import Thread

from fastapi import FastAPI, Depends
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, SQLModel
from fastapi.middleware.cors import CORSMiddleware

from backend.app import database
from backend.app.database import engine
from backend.app.lib import houses, calculator, models
from backend.app.lib.financing_numbers import optimal_financing, fast_forward_years
from backend.app.lib.models import State, House, ChangeAge, HouseResponse

app = FastAPI()
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)-8s | "
                                               "%(module)s:%(funcName)s:%(lineno)d - %(message)s")

MIN_PRICE_DIFF = 2000000
MAX_RESULTS_HOUSES = 10
SAVINGS_RATE = 0.2

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    # Erlaube die von dir verwendeten Methoden (POST) und ggf. andere Standardmethoden
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    # Erlaube Content-Type, Authorization und alle anderen Standard-Header
    allow_headers=["*", "Content-Type"],
)

LOGGER = logging.getLogger("House offers")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def insert_into_db(state: State, db: Session = Depends(get_db)):
    # load 200 listings for the selected region and store them in our database
    house_list = houses.load_houses(state.filter_option, 200)
    for house in house_list:
        try:
            db.add(house)
            db.commit()
            db.refresh(house)
        except IntegrityError as e:
            db.rollback()
            LOGGER.info(e)


@app.post("/initialize-game")
def initialize(state: State, db: Session = Depends(get_db)):
    return state


@app.post("/change-age")
def change_age(request_state: ChangeAge):
    if request_state.delta_age == -1:
        request_state.delta_age = fast_forward_years(request_state.state)
    
    state = request_state.state
    state.age += request_state.delta_age

    for chance in state.chance:
        state.finance.capital -= (chance.yearly_cost * request_state.delta_age)
        state.finance.capital -= chance.onetime_cost
        chance.onetime_cost = 0

    state.finance.capital += state.finance.income * SAVINGS_RATE * 12 * request_state.delta_age

    state.equity = [0, 0]
    store = [0, 0]
    t = Thread(target = calculator.calculate_equity, args=(10, state.copy(), store, 0))
    t2 = Thread(target = calculator.calculate_equity, args=(25, state.copy(), store, 1))

    t.start()
    t2.start()

    t.join()
    t2.join()

    state.equity = store

    state.square_id += request_state.delta_age
    return state


@app.post("/houses")
def get_houses(state: State, db: Session = Depends(get_db), ):
    # temp_result =
    if (db.query(models.House)
            .filter(models.House.city == state.filter_option.city)
            .filter(models.House.region == state.filter_option.region)
            .first()) is None:
        LOGGER.info("Region/city not in DB. Accessing API now")
        insert_into_db(state, db)

    result_houses = (db.query(models.House)
                     .filter(models.House.region == state.filter_option.region)
                     .filter(models.House.city == state.filter_option.city)
                     .filter(House.buying_price <= state.equity[1])
                     .filter(House.buying_price >= state.equity[0])
                     .limit(MAX_RESULTS_HOUSES).all())

    response = []
    for h in result_houses:
        duration = f"{str(optimal_financing(state=state, house=h))}"
        house = HouseResponse(
            id=h.id,
            title=h.title,
            buying_price=h.buying_price,
            rooms=h.rooms,
            square_meter=h.square_meter,
            image_url=h.image_url,
            construction_year=h.construction_year,
            condition=h.condition,
            region=h.region,
            city=h.city,
            link=h.link,
            finance_duration=duration,
        )
        response.append(house)

    return response


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
