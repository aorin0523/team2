from fastapi import APIRouter, HTTPException
# Requestの代わりにPydanticのBaseModelをインポートします
from pydantic import BaseModel
from modules.db.enterprises import Enterprises

# --- ここから追加 ---
# リクエストボディの型を定義するクラスを作成します
class DescriptionUpdate(BaseModel):
    description: str
# --- ここまで追加 ---

router = APIRouter()

# (get_enterprises, get_enterpriseのエンドポイントは変更なし)
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

# --- ここから修正 ---
# editDescriptionエンドポイントを修正
@router.post("/{enterprise_id}/editDescription")
# 関数の引数を(..., request: Request)から(..., item: DescriptionUpdate)に変更
async def edit_enterprise_description(enterprise_id: str, item: DescriptionUpdate):
    
    # itemオブジェクトから直接descriptionを取得できます
    description_to_update = item.description
    
    db_enterprises = Enterprises()
    result = db_enterprises.update_description(enterprise_id, description_to_update)
    
    if result["updated_rows"] == 0:
        raise HTTPException(status_code=404, detail="Enterprise not found or no change made")
    
    return {"message": "Description updated successfully"}
# --- ここまで修正 ---