import logging

import requests

from backend.app.lib.models import State

LOGGER = logging.getLogger("Calculator")
URL = "https://www.interhyp.de/customer-generation/budget/calculateMaxBuyingPower"


def calculate_equity(mortgage_years: int, state: State):
    LOGGER.info(f"Calculating maximum affordable real estate value for state {state}")
    session = requests.Session()

    data = {
        "monthlyRate": state.finance.income * state.finance.desired_rates,
        "equityCash": state.finance.capital,
        "federalState": "DE-BY",
        "amortisation": 1.5,
        "fixedPeriod": 10,
        "salary": state.finance.income,
        "additionalLoan": 0,
        "desiredTotalTime": mortgage_years,
        "calculationMode": "TIMESPAN"
    }

    response = session.post(URL, json=data)
    session.close()

    LOGGER.info(f"Response from calculator: {response.status_code} {response.text}")
    response = response.json()

    return response["scoringResult"]["priceBuilding"]

