# implemetn pydantic datastructure like in Readme.md
from enum import Enum

from pydantic.v1 import BaseModel

class House(BaseModel):
    id: str
    title: str
    buying_price: int
    rooms: int
    square_meter: int
    image_url: str
    construction_year: int
    condition: str

class FilterOptions(BaseModel):
    max_budget: int
    type: str
    sort_type: str
    size: int
    city: str

    def to_string(self):
        return f"{self.type}|{self.sort_type}|{self.size}|{self.city}"

class ChanceType(str, Enum):
    CHILD = "child"
    CONSUME = "consume"

class Chance(BaseModel):
    chance_type: ChanceType
    yearly_cost: int
    onetime_cost: int
    age: int

class Finance(BaseModel):
    income: int
    capital: int
    interest_rates: int
    desired_rates: int

class State(BaseModel):
    age: int
    # computed equity by the budget calculator
    equity: int
    # current location in the game
    square_id: int
    filter_option: FilterOptions
    chance: Chance | None
    finance: Finance
