import numpy as np
from backend.app.lib.calculator import calculate
from backend.app.lib.models import State, Finance, House, FilterOptions, Chance, ChanceType


min_mortgage_time = 10
max_mortgage_time = 20

def max_min_range(state: State):
    """
    Computes the range of displayed houses
    """

    max_mortgage_time_net = min(65 - state.square_id, max_mortgage_time)

    return_state = calculate(mortgage_years=max_mortgage_time_net, state=state)
    max_net_price = return_state.equity
    return_state = calculate(mortgage_years=min_mortgage_time, state=state)
    min_net_price = return_state.equity

    return (min_net_price, max_net_price)


def optimal_financing(state: State, house: House) -> int:
    """
    Computes optimal financing duration in months consuming all of your accumulated capital and setting mthly saving rate to annuity payments
    """
    
    regional_tax = property_tax_list()
    supplementary_tax_scalar = (1 + (regional_tax[state.filter_option.region] + 3.57 + 2.0)/100)

    brutto_buying_price = house.buying_price * supplementary_tax_scalar

    monthly_rate = state.finance.interest_rates / 100 / 12
    loan = brutto_buying_price - state.finance.capital
    monthly_annuity_payments = state.finance.desired_rates

    # compute months needed to pay back above loan
    m = np.log(1/(1-loan*monthly_rate/monthly_annuity_payments))/np.log(1+monthly_rate)
    y = np.round(m/12, 2)

    return y

def property_tax_list():
    """
    List of all regions in Germany and corresponding taxes
    """


    property_tax = {
        "Baden-Württemberg": 5.0,
        "Bayern": 3.5,
        "Berlin": 6.0,
        "Brandenburg": 6.5,
        "Bremen": 5.0,
        "Hamburg": 5.5,
        "Hessen": 6.0,
        "Mecklenburg-Vorpommern": 6.0,
        "Niedersachsen": 5.0,
        "Nordrhein-Westfalen": 6.5,
        "Rheinland-Pfalz": 5.0,
        "Saarland": 6.5,
        "Sachsen": 5.5,
        "Sachsen-Anhalt": 5.0,
        "Schleswig-Holstein": 6.5,
        "Thüringen": 5.0,
        }

    return property_tax

def fast_forward_years(range_min: float, range_max: float, state: State) -> int:
    """
    Method to compute that years needed to unlock new class
    """

    mid_price = (range_min + range_max)/2

    # Current state
    monthly_rate = state.finance.interest_rates / 100 / 12

    # monthly annuity rate only
    new_total_loan = state.finance.desired_rates * ((1+monthly_rate)**min_mortgage_time-1)/(monthly_rate*(1+monthly_rate)**min_mortgage_time)

    # New capital = old_capital + one_time_payements + recurrent_savings
    capital_without_added_savings = state.finance.capital + state.chance[0].onetime_cost

    minimal_time_float = (mid_price - capital_without_added_savings - new_total_loan)/(state.finance.desired_rates*12)

    # ceiling function and cap to next age
    minimal_fast_forward_time = max(int(minimal_time_float) + 1, 1)

    return minimal_fast_forward_time


if __name__ == "__main__":

    chance_type = ChanceType("child")
    chance = Chance(chance_type=chance_type, yearly_cost=0, onetime_cost=1000, age=200)
    house = House(id="10", title="-", buying_price=500000, rooms=2, square_meter=200, image_url="-", construction_year=1984, condition="MINT", region="Bayern")
    finance = Finance(income=10000, capital=100000, interest_rates=4, desired_rates=2000)
    filter_options = FilterOptions(max_budget=50000, type="APARTMENT", sort_type="-", size=100, city="-", region="Bayern")
    state = State(age=20, equity=2, square_id=20, filter_option=filter_options, chance=[chance], finance=finance)

    print(chance)

    opt_year = optimal_financing(state=state, house=house)
    range_min, range_max = max_min_range(state)
    ff_years = fast_forward_years(range_min=range_min, range_max=range_max, state=state)

    print(f"Optimal investment window {opt_year}")
    print(f"Current investment range {range_min}, {range_max}")
    print(f"Fast Forward years {ff_years}")