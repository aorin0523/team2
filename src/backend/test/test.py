from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
def get(request: Request): 
    """
    見本用GETエンドポイント
    """
    return {"message": "Test endpoint is working!"}

@router.post("/")
def post(request: Request):
    """
    見本用POSTエンドポイント
    """
    data = request.json()
    return {"message": "Test endpoint received data!", "data": data}

@router.put("/")
def put(request: Request):
    """
    見本用PUTエンドポイント
    """
    data = request.json()
    return {"message": "Test endpoint updated data!", "data": data}

@router.delete("/")
def delete(request: Request):
    """
    見本用DELETEエンドポイント
    """
    data = request.json()
    return {"message": "Test endpoint deleted data!", "data": data}
