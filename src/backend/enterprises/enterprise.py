from fastapi import APIRouter, Request, FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import io
import uuid
from modules.db.enterprises import Enterprises
from pydantic import BaseModel
router = APIRouter()




@router.get("/")
async def get_enterprises():
    """
    ユーザ情報を全件取得するエンドポイント
    """

    from modules.db.enterprises import Enterprises
    
    enterprises = Enterprises()    
    return enterprises.get_all_enterprises()

# GET /enterprises/:id
@router.get("/{enterprise_id}")
async def get_enterprise(enterprise_id: int):
    db_enterprises = Enterprises()
    enterprise = db_enterprises.get_enterprise_by_id(enterprise_id)
    if enterprise is None:
        raise HTTPException(status_code=404, detail="Enterprise not found")
    return enterprise

# /enterprises/:id/editDescription
@router.post("/{enterprise_id}/editDescription")
async def edit_enterprise_description(enterprise_id: int, update_data: str):
    db_enterprises = Enterprises()
    result = db_enterprises.update_description(enterprise_id, update_data.description)
    if result["updated_rows"] == 0:
        raise HTTPException(status_code=404, detail="Enterprise not found")
    return {"message": "Description updated successfully"}