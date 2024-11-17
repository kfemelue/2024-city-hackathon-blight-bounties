import data_model
from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]


# Helper function to convert MongoDB ObjectId to string
def cleanup_request_serializer(request) -> dict:
    request["_id"] = str(request["_id"])  # Convert ObjectId to string
    return request


# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def get_homepage():
    return {"Ping": "Pong"}


@app.get("/requests/")
async def get_all_requests():
    """
    Fetch all cleanup requests from MongoDB.
    """
    try:
        stored_requests = list(collection.find({}))
        return {"requests": [cleanup_request_serializer(req) for req in stored_requests]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {e}")


@app.get("/requests/{id}")
async def get_request_by_incident_id(id: str):
    """
    Fetch a single cleanup request by its incident_id.
    """
    try:
        # Find the document in the MongoDB collection by incident_id
        request = collection.find_one({"_id": ObjectId(id)})
        print(id)
        if not request:
            raise HTTPException(status_code=404, detail=f"Request with _id {id} not found")

        # Serialize the result
        serialized_request = cleanup_request_serializer(request)
        return {"request": serialized_request}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {e}")


@app.post("/add_request/")
async def add_request(request: data_model.CleanupRequest):
    """
    Add a new cleanup request to MongoDB.
    """
    try:
        request_dict = request.dict(by_alias=True)
        result = collection.insert_one(request_dict)
        return {"message": "Request added successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add request: {e}")


@app.post("/claim/{id}")
async def claim_request(id: str, claimed_by: str = Form(...)):
    """
    Claim a cleanup request.
    """
    try:
        result = collection.find_one({"_id": ObjectId(id)})
        if not result:
            raise HTTPException(status_code=404, detail="Request not found")
        if result.get("case_status", "").lower() != "open":
            raise HTTPException(status_code=400, detail="Request already claimed or completed")

        collection.update_one({"_id": ObjectId(request_id)}, {"$set": {"case_status": "claimed", "claimed_by": claimed_by}})
        return {"message": "Request claimed successfully", "claimed_by": claimed_by}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to claim request: {e}")


@app.post("/upload/")
async def upload_photos(
    request_id: str = Form(...),
    photo_type: str = Form(...),  # 'before' or 'after'
    file: UploadFile = None
):
    """
    Upload before or after photos for a cleanup request.
    """
    try:
        result = collection.find_one({"_id": ObjectId(request_id)})
        if not result:
            raise HTTPException(status_code=404, detail="Request not found")

        if photo_type not in ["before", "after"]:
            raise HTTPException(status_code=400, detail="Invalid photo type")

        # Save file
        save_dir = "./photos/"
        os.makedirs(save_dir, exist_ok=True)
        file_path = os.path.join(save_dir, f"{request_id}_{photo_type}.jpg")

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        # Update MongoDB
        collection.update_one({"_id": ObjectId(request_id)}, {"$set": {f"{photo_type}_photo": file_path}})
        if photo_type == "after":
            collection.update_one({"_id": ObjectId(request_id)}, {"$set": {"case_status": "completed"}})

        return {"message": f"{photo_type} photo uploaded successfully", "file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload photo: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
