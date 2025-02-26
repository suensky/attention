from fastapi import FastAPI
from enum import Enum
from pydantic import BaseModel

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name.value == ModelName.alexnet.value:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}
    
    return {"model_name": model_name, "message": "horraayyy"}

@app.get("/items/{item_id}")
async def read_user_item(
    item_id: str, needy: str, skip: int = 0, limit: int | None = None
):
    item = {"item_id": item_id, "needy": needy, "skip": skip, "limit": limit}
    return item

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/")
async def create_item(item: Item):
    return {"description": f"{item.name}'s price is {item.price} with tax {item.tax}"}
