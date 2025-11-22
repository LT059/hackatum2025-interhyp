import logging

import requests
from pydantic.v1 import ValidationError
from backend.app.lib.models import FilterOptions, House

LOGGER = logging.getLogger("House offers")
API_URL = "https://thinkimmo-api.mgraetz.de/thinkimmo"

cache = {}


def load_houses(filter_options: FilterOptions, max_results: int):

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
        "size": max_results,
        "geoSearches": {
            "geoSearchQuery": filter_options.city,
            "geoSearchType": "city",
            "region": filter_options.region
        }
    }
    response = session.post(API_URL, json=api_filter)
    session.close()

    LOGGER.info(f"Response from real estate api: {response.status_code} {response.text}")
    response = response.json()

    results = []
    for h in response["results"]:
        try:
            image_url = ""
            if len(h["images"]) > 0:
                image_url = h["images"][0]["originalUrl"]

            house = House(
                id=h["id"],
                title=h["title"],
                buying_price=h["buyingPrice"],
                rooms=h["rooms"],
                square_meter=h["squareMeter"],
                image_url=image_url,
                condition=h["condition"],
                construction_year=h["constructionYear"],
            )
            results.append(house)
        except ValidationError as e:
            LOGGER.info(f"Parsing error, skipping this offer.")

    if len(cache.keys()) < 10000:
        cache.update({filter_options.to_string(): results})
    LOGGER.info(f"Fetched {len(results)} real estate offers from API.")
    print(f"Fetched {len(results)} real estate offers from API.")
    return {"results": results}

# print(load_houses(FilterOptions(type="APARTMENTBUY", sort_type="publishDate", city="Muenchen", min_price=0, max_budget=10, size=10), max_results=20000))