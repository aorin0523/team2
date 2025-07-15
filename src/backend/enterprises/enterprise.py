from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from modules.db.enterprises import Enterprises


# リクエストボディの型を定義するクラス
class DescriptionUpdate(BaseModel):
    description: str

class EnterpriseCreate(BaseModel):
    name: str
    description: str = ""


router = APIRouter()


@router.get("/")
async def get_enterprises():
    enterprises = Enterprises()    
    return enterprises.get_all_enterprises()

@router.get("/{enterprise_id}")
async def get_enterprise(enterprise_id: str):
    db_enterprises = Enterprises()
    enterprise = db_enterprises.get_enterprise_by_id(enterprise_id)
    if enterprise is None:
        raise HTTPException(status_code=404, detail="Enterprise not found")
    return enterprise


# editDescriptionエンドポイントを修正
@router.post("/{enterprise_id}/editDescription")
async def edit_enterprise_description(enterprise_id: str, item: DescriptionUpdate):
    
    # itemオブジェクトから直接descriptionを取得
    description_to_update = item.description
    
    db_enterprises = Enterprises()
    result = db_enterprises.update_description(enterprise_id, description_to_update)
    
    if result["updated_rows"] == 0:
        raise HTTPException(status_code=404, detail="Enterprise not found or no change made")
    
    return {"message": "Description updated successfully"}

@router.post("/")
async def create_enterprise(enterprise_data: EnterpriseCreate):
    """
    新しい企業を作成するエンドポイント
    """
    try:
        db_enterprises = Enterprises()
        result = db_enterprises.create_enterprise(
            name=enterprise_data.name,
            description=enterprise_data.description
        )
        
        if result["status"] == "ok":
            return {
                "status": "success",
                "enterprise_id": result["enterprise_id"],
                "message": "企業が正常に作成されました"
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))