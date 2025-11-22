import numpy as np
from calculator import calculate_equity
from models import State, Finance, House, FilterOptions


def max_min_range(state: State):
    """
    Computes the range of displayed houses
    """

    min_mortgage_time = 10
    max_mortgage_time = min(65 - state.age, 20)

    return_state = calculate_equity(mortgage_years=max_mortgage_time, state=state)
    max_net_price = return_state.equity
    return_state = calculate_equity(mortgage_years=min_mortgage_time, state=state)
    min_net_price = return_state.equity

    return (min_net_price, max_net_price)


def optimal_financing(state: State, finance: Finance, house: House) -> int:
    """
    Computes optimal financing duration in months consuming all of your accumulated capital and setting mthly saving rate to annuity payments
    """
    
    regional_tax = property_tax_list()
    supplementary_tax_scalar = (1 + (regional_tax[state.filter_option.region] + 3.57 + 2.0)/100)

    brutto_buying_price = house.buying_price * supplementary_tax_scalar

    monthly_rate = finance.interest_rates / 100 / 12
    loan = brutto_buying_price - finance.capital
    monthly_annuity_payments = finance.desired_rates

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


if __name__ == "__main__":

    house = House(id=10, title="-", buying_price=500000, rooms=2, square_meter=200, image_url="-", construction_year=1984, condition="MINT", region="Bayern")
    finance = Finance(income=10000, capital=100000, interest_rates=4, desired_rates=2000)
    filter_options = FilterOptions(max_budget=50000, min_price=100000, type="APARTMENT", sort_type="-", size=100, city="-", region="Bayern")
    state = State(age=20, equity=2, square_id=20, filter_option=filter_options, chance=None, finance=finance)

    opt_year = optimal_financing(state=state, finance=finance, house=house)
    range_min, range_max = max_min_range(state)

    print(f"Optimal investment window {opt_year}")
    print(f"Current investment range {range_min}, {range_max}")
