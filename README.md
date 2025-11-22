# hackatum2025-interhyp

## Data structures:
- filter_options: type, sort_type, size, city (filter properties for houses)
- house: id, title, buying price, rooms, squaremeter, image_url(house data)
- chance: chance_type, age (life decisions made at age)
- chance_type: child, consume (may be extended, controlled change of finances)
- state: age, equity, square_id, filter_options, chance, finance
- finance:  income, capital,interest_rates, desired_rates, savings_rate


## How to run backend
Paste these commands into the terminal

```bash
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Find backend under http://127.0.0.1:8000/
## How to run frontend
Paste these commands into the terminal
```bash
npm i
npm run dev
```