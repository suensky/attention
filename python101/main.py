from fastapi import FastAPI, File, UploadFile
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

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    # Read the file content
    contents = await file.read()
    
    # Here you could process the file contents or save it
    # For example, to save the file:
    # with open(f"uploaded_{file.filename}", "wb") as f:
    #     f.write(contents)
    
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "file_size": len(contents)
    }