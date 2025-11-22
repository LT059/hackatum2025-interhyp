# implemetn pydantic datastructure like in Readme.md
from enum import Enum

from pydantic.v1 import BaseModel

class House(BaseModel):
    id: int
    title: str
    buying_price: int
    rooms: int
    square_meter: int
    image_url = str

class FilterOptions(BaseModel):
    type: str
    sort_type: str
    size: int
    city: str

class ChanceType(BaseModel, Enum):
    CHILD = 0
    CONSUME = 1

class Chance(BaseModel):
    chance_type: ChanceType
    age: int

class Finance(BaseModel):
    income: int
    capital: int
    interest_rates: int
    desired_rates: int

class State(BaseModel):
    age: int
    equity: int
    # current location in the game
    square_id: int
    filter_option: FilterOptions
    chance: Chance
