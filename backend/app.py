from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.responses import JSONResponse
import requests
import os

app = FastAPI()

# In-memory data storage
cleanup_requests = []  # Array to store cleanup requests
photos_storage = {}  # Dictionary to store photo paths for each request


# API Endpoints
@app.get("/requests/")
async def get_all_requests():
    """
    Fetch all cleanup requests from the external API and store them in memory.
    Return the stored data.
    """
    try:
        # Fetch data from the external API
        response = requests.get("https://data.memphistn.gov/resource/hmd4-ddta.json?request_status=Open")
        response.raise_for_status()
        api_data = response.json()

        # Populate the in-memory dictionary
        for item in api_data:
            cleanup_requests.append(item)

        return {"requests": cleanup_requests}

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {e}")


@app.get("/search/")
async def search_requests(status: str = "open"):
    """Search for cleanup requests by status."""
    filtered_requests = [
        {"id": req_id, "data": req_data}
        for req_id, req_data in cleanup_requests.items()
        if req_data["status"] == status
    ]
    return {"requests": filtered_requests}


@app.post("/claim/{request_id}")
async def claim_request(request_id: int, claimed_by: str = Form(...)):
    """Claim a cleanup request."""
    request = cleanup_requests.get(request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if request["status"] != "open":
        raise HTTPException(status_code=400, detail="Request already claimed or completed")

    request["status"] = "claimed"
    request["claimed_by"] = claimed_by
    return {"message": "Request claimed successfully", "claimed_by": claimed_by}


@app.post("/upload/")
async def upload_photos(
        request_id: int = Form(...),
        photo_type: str = Form(...),  # 'before' or 'after'
        file: UploadFile = None
):
    """Upload before or after photos for a cleanup request."""
    request = cleanup_requests.get(request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if photo_type not in ["before", "after"]:
        raise HTTPException(status_code=400, detail="Invalid photo type")

    # Save file
    save_dir = "./photos/"
    os.makedirs(save_dir, exist_ok=True)
    file_path = os.path.join(save_dir, f"{request_id}_{photo_type}.jpg")

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # Update the in-memory storage
    request[f"{photo_type}_photo"] = file_path
    if photo_type == "after":
        request["status"] = "completed"  # Mark as completed after 'after' photo

    return {"message": f"{photo_type} photo uploaded successfully", "file_path": file_path}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
