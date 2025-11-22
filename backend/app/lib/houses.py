import logging

import requests
from pydantic.v1 import ValidationError

from backend.app.lib.models import FilterOptions, House

LOGGER = logging.getLogger("House offers")
API_URL = "https://thinkimmo-api.mgraetz.de/thinkimmo"

cache = {}

def load_houses(filter_options: FilterOptions):
    LOGGER.info(f"Loading real estate offers for filter options {filter_options}")
    if filter_options.to_string() in cache:
        return cache[filter_options.to_string()]

    session = requests.Session()

    api_filter = {
        "active": True,
        "type": filter_options.type,
        "sortBy": "desc",
        "sortKey": filter_options.sort_type,
        "from": 0,
        "size": 20,
        "geoSearches": {
            "geoSearchQuery": filter_options.city,
        }
    }
    response = session.post(API_URL, json=api_filter)
    session.close()

    LOGGER.info(f"Response from real estate api: {response.status_code} {response.text}")
    response = response.json()

    results = []
    for h in response["results"]:
        try:
            house = House(
                id=h["id"],
                title=h["title"],
                buying_price=h["buyingPrice"],
                rooms=h["rooms"],
                square_meter=h["squareMeter"],
                image_url = h["images"][0]["originalUrl"],
                condition=h["condition"],
                construction_year=h["constructionYear"],
            )
            results.append(house)
        except ValidationError or IndexError as e:
            LOGGER.info(f"Parsing error, skipping this offer.")


    if len(cache.keys()) < 10000:
        cache.update({filter_options.to_string(): results})
    return {"results": results}
