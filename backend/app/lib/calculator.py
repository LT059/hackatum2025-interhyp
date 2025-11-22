import logging

import requests

from backend.app.lib.models import State

LOGGER = logging.getLogger("Calculator")
URL = "https://www.interhyp.de/customer-generation/budget/calculateMaxBuyingPower"


def calculate(delta_age: int, state: State):
    LOGGER.info(f"Calculating maximum affordable real estate value for state {state}")
    session = requests.Session()

    data = {
        "monthlyRate": state.finance.desired_rates,
        "equityCash": state.equity,
        "federalState": "DE-BY",
        "amortisation": 1.5,
        "fixedPeriod": state.square_id,
        "salary": state.finance.income,
        "additionalLoan": 0,
        "desiredTotalTime": state.square_id,
        "calculationMode": "TIMESPAN"
    }

    response = session.post(URL, json=data)
    session.close()

    LOGGER.info(f"Response from calculator: {response.status_code} {response.text}")
    response = response.json()

    state.equity = response["scoringResult"]["priceBuilding"]
    return state
