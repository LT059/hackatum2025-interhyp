from fastapi import FastAPI

from backend.app.lib.models import State

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/init")
def initialize(state: State):
    return {"state": state}