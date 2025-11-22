# implemetn pydantic datastructure like in Readme.md
from enum import Enum

from pydantic.v1 import BaseModel
from sqlmodel import SQLModel, Field


class House(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    title: str = Field(default="", index=True)
    buying_price: int = Field(default=0, index=True)
    rooms: int = Field(default=0, index=False)
    square_meter: float = Field(default=0.0, index=False)
    image_url: str = Field(default="", index=False)
    construction_year: int = Field(default=0, index=False)
    condition: str = Field(default="", index=False)
    region: str = Field(default="", index=False)
    city: str = Field(default="", index=False)


class FilterOptions(BaseModel):
    max_budget: int
    type: str
    sort_type: str
    size: int
    city: str
    region: str

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
    interest_rates: float
    desired_rates: float


class State(BaseModel):
    age: int
    # computed equity by the budget calculator
    equity: int
    # current location in the game
    square_id: int
    filter_option: FilterOptions
    chance: list[Chance] | None
    finance: Finance
