import logging
from typing import Annotated

from fastapi import FastAPI, Depends
from sqlalchemy import create_engine
from sqlmodel import Session, SQLModel, select

from backend.app.lib import houses, calculator
from backend.app.lib.models import State, FilterOptions, House

app = FastAPI()
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s | %(levelname)-8s | "
                                                "%(module)s:%(funcName)s:%(lineno)d - %(message)s")

sqlite_file_name = "houses.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def load_houses_db(session: SessionDep, min_price: int, max_price: int):
    return session.exec(
        select(House).where(House.buying_price <= max_price, House.buying_price >= min_price).limit(5))


def insert_into_db(house: House, session: SessionDep):
    session.add(house)
    session.commit()
    session.refresh(house)

@app.post("/initialize-game")
def initialize(state: State):

    houses.load_houses(state.filter_option, 200)
    return {"state": state}


@app.post("/change-age")
def change_age(delta_age: int, state: State):
    return calculator.calculate(delta_age, state)


@app.post("/houses")
def get_houses(state: State, session: SessionDep):
    return load_houses_db(session=session, min_price=state.filter_option.min_price, max_price=state.filter_option.max_budget)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()