import json
import logging

from fastapi import FastAPI, Depends
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, SQLModel, select
from fastapi.middleware.cors import CORSMiddleware

from backend.app import database
from backend.app.database import engine
from backend.app.lib import houses, calculator, models
from backend.app.lib.models import State, House

app = FastAPI()
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)-8s | "
                                               "%(module)s:%(funcName)s:%(lineno)d - %(message)s")
origins = [
    "http://localhost:3000/",
    "http://127.0.0.1:3000/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=[""],
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


@app.post("/initialize-game")
def initialize(state: State, db: Session = Depends(get_db)):
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
    return state


@app.post("/change-age")
def change_age(delta_age: int, state: State):
    return calculator.calculate(delta_age, state)


@app.post("/houses")
def get_houses(state: State, db: Session = Depends(get_db),):
    result = db.query(models.House).filter(House.buying_price <= state.filter_option.max_budget).filter(House.buying_price >= state.filter_option.min_price).limit(10).all()
    return result

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
