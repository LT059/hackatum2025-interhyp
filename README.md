# hackatum2025-interhyp
Submission for the interhyp challenge at the HackaTUM 2025.


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