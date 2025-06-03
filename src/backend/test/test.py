from fastapi import APIRouter, Request, FastAPI, File, UploadFile
from minio import Minio
from minio.error import S3Error
import io
import os
import uuid

router = APIRouter()

@router.get("/")
def get(request: Request): 
    """
    見本用GETエンドポイント
    """
    return {"message": "Test endpoint is working!"}

from pydantic import BaseModel
class TestData(BaseModel):
    name: str
    value: int

@router.post("/")
async def post(request: Request, data: TestData):
    """
    見本用POSTエンドポイント
    """
    return {"message": "Test endpoint updated data!", "data": data}

@router.put("/")
async def put(request: Request, data: TestData):
    """
    見本用PUTエンドポイント
    """
    return {"message": "Test endpoint updated data!", "data": data}

@router.delete("/")
async def delete(request: Request, data: TestData):
    """
    見本用DELETEエンドポイント
    """
    return {"message": "Test endpoint updated data!", "data": data}

# MinIOにファイルをアップロードするときの見本
from modules.minio import upload_file

@router.post("/upload")
async def upload(request: Request, file: UploadFile = File(...)):
    """
    ファイルアップロードの見本用エンドポイント
    """
    
    content = await file.read()
    file_uuid = str(uuid.uuid4())

    upload_file(
        bucket_name="temp",
        file_name=file_uuid,
        file_content_type=file.content_type,
        file_content=content
    )
    return {"status": "ok", "file_name": file.filename, "file_uuid": file_uuid}
