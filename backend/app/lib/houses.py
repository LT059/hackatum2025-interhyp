import logging

import requests
from pydantic.v1 import ValidationError
from backend.app.lib.models import FilterOptions, House

LOGGER = logging.getLogger("House offers")
API_URL = "https://thinkimmo-api.mgraetz.de/thinkimmo"



def load_houses(filter_options: FilterOptions, max_results: int):

    LOGGER.info(f"Loading real estate offers for filter options {filter_options}")
    session = requests.Session()

    api_filter = {
        "active": True,
        "type": filter_options.type,
        "sortBy": "desc",
        "sortKey": "publishDate",
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

    if response.status_code != 200 and response.status_code != 201:
        LOGGER.error(f"Response from real estate api: {response.status_code} {response.text}")
    response = response.json()

    results = []
    for h in response["results"]:
        try:
            image_url = ""
            if len(h["images"]) > 0:
                image_url = h["images"][0]["originalUrl"]

            city=""
            if h["address"] is not None:
                if "city" in h["address"]:
                    city = h["address"]["city"]
                elif "town" in h["address"]:
                    city = h["address"]["town"]

            link=""
            if h["platforms"] is not None and len(h["platforms"]) > 0:
                if "url" in h["platforms"][0]:
                    link = h["platforms"][0]["url"]

            rooms=0
            if "rooms" in h:
                rooms = h["rooms"]

            square_meter =0.0
            if "squareMeter" in h:
                square_meter = h["squareMeter"]

            condition = ""
            if "condition" in h:
                condition = h["condition"]

            constructionYear=0
            if "constructionYear" in h:
                constructionYear = h["constructionYear"]

            region = ""
            if "region" in h:
                region = h["region"]

            house = House(
                id=h["id"],
                title=h["title"],
                buying_price=h["buyingPrice"],
                rooms=rooms,
                square_meter=square_meter,
                image_url=image_url,
                condition=condition,
                construction_year=constructionYear,
                region=region,
                city=city,
                link=link,
                type=filter_options.type
            )
            results.append(house)
        except ValidationError as e:
            LOGGER.info(f"Parsing error, skipping this offer.")

    LOGGER.info(f"Fetched {len(results)} real estate offers from API.")
    return results

# print(load_houses(FilterOptions(type="APARTMENTBUY", sort_type="publishDate", city="Muenchen", min_price=0, max_budget=10, size=10), max_results=20000))