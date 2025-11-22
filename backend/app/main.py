import logging

from fastapi import FastAPI

from backend.app.lib import houses, calculator
from backend.app.lib.models import State

app = FastAPI()
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s | %(levelname)-8s | "
                                                "%(module)s:%(funcName)s:%(lineno)d - %(message)s")


@app.post("/initialize-game")
def initialize(state: State):
    return {"state": state}


@app.post("/change-age")
def change_age(delta_age: int, state: State):
    return calculator.calculate(delta_age, state)


@app.post("/houses")
def get_houses(state: State):
    return houses.load_houses(state.filter_option)
