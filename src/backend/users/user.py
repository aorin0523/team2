from fastapi import APIRouter, Request, FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.responses import StreamingResponse
from modules.db.users import Users
from modules.db.user_offers import UserOffers
from auth.token import get_current_enterprise_user, User

router = APIRouter()

from pydantic import BaseModel
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class EnterpriseUserCreate(BaseModel):
    name: str
    email: str
    password: str
    enterprise_id: str
    rank: int = 1

# 初期値はNone(受け取った項目のみ更新する)
class UserUpdate(BaseModel):
    name: str = None
    email: str = None
    password: str = None
    rank: int = None

# プロフィール編集用のモデル（ランクとスキルのみ変更可能）
class UserProfileUpdate(BaseModel):
    rank: int
    skills: list[str]  # スキル名のリスト

class UserOfferApply(BaseModel):
    user_id: str
    offer_id: str

class UserOfferFavorite(BaseModel):
    user_id: str
    offer_id: str

class UserAssign(BaseModel):
    user_id: str
    offer_id: str

@router.get("/all")
async def read_all_users():
    """
    ユーザ情報を全件取得するエンドポイント
    """
    return Users().get_all_users()

@router.get("/{user_id}")
async def read_user(user_id: str):
    """
    ユーザ情報を取得するエンドポイント
    """
    return Users().get_users(id=user_id)

@router.post("/")
async def create_user(data: UserCreate):
    """
    ユーザーを登録するエンドポイント
    """
    return Users().create_user(
            name=data.name,
            email=data.email,
            password=data.password
        )

@router.post("/enterprise")
async def create_enterprise_user(data: EnterpriseUserCreate):
    """
    企業ユーザーを登録するエンドポイント
    """
    return Users().create_enterprise_user(
        name=data.name,
        email=data.email,
        password=data.password,
        enterprise_id=data.enterprise_id,
        rank=data.rank
    )

@router.put("/{user_id}")
async def update_user(user_id: str, data: UserUpdate):
    """
    ユーザ情報を更新するエンドポイント
    """
    return Users().update_user(
        id=user_id,
        name=data.name,
        email=data.email,
        password=data.password,
        rank=data.rank
    )

@router.put("/{user_id}/profile")
async def update_user_profile(user_id: str, data: UserProfileUpdate):
    """
    ユーザープロフィール（ランクとスキル）を更新するエンドポイント
    """
    try:
        print(f"DEBUG: Updating profile for user_id: {user_id}")
        print(f"DEBUG: Data received: rank={data.rank}, skills={data.skills}")
        
        result = Users().update_user_profile(
            user_id=user_id,
            rank=data.rank,
            skills=data.skills
        )
        
        print(f"DEBUG: Result from Users().update_user_profile: {result}")
        
        if result["status"] == "ok":
            return {"status": "success", "message": "プロフィールを更新しました"}
        else:
            print(f"ERROR: Database operation failed: {result}")
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        print(f"ERROR: Exception in update_user_profile: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/profile")
async def get_user_profile(user_id: str):
    """
    ユーザープロフィール（基本情報 + スキル）を取得するエンドポイント
    """
    try:
        result = Users().get_user_profile(user_id)
        if result["status"] == "ok":
            return {"status": "success", "profile": result["profile"]}
        else:
            raise HTTPException(status_code=404, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/skills/all")
async def get_all_skills():
    """
    全スキル一覧を取得するエンドポイント
    """
    try:
        result = Users().get_all_skills()
        if result["status"] == "ok":
            return {"status": "success", "skills": result["skills"]}
        else:
            raise HTTPException(status_code=500, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """
    ユーザ情報を削除するエンドポイント
    """
    return Users().delete_user(id=user_id)

# UserOffersのエンドポイント
@router.post("/apply")
async def apply_to_offer(data: UserOfferApply):
    """
    ユーザーが求人に応募するエンドポイント
    """
    try:
        result = UserOffers().apply_to_offer(data.user_id, data.offer_id)
        if result:
            return {"status": "success", "message": "応募が完了しました"}
        else:
            raise HTTPException(status_code=400, detail="応募に失敗しました")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/applications")
async def get_user_applications(user_id: str):
    """
    ユーザーの応募履歴を取得するエンドポイント
    """
    try:
        applications = UserOffers().get_user_applications(user_id)
        return {"status": "success", "applications": applications}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/offer/{offer_id}/status")
async def check_application_status(user_id: str, offer_id: str):
    """
    ユーザーが特定の求人に応募済みかチェックするエンドポイント
    """
    try:
        result = UserOffers().check_application_status(user_id, offer_id)
        if result["status"] == "ok":
            return {
                "status": "success", 
                "applied": result["applied"],
                "favorite": result["favorite"]
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/favorite")
async def toggle_favorite(data: UserOfferFavorite):
    """
    ユーザーがオファーを「気になる」に追加/削除するエンドポイント
    """
    try:
        result = UserOffers().toggle_favorite(data.user_id, data.offer_id)
        if result["status"] == "ok":
            return {"status": "success", "message": result["message"]}
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/favorites")
async def get_user_favorites(user_id: str):
    """
    ユーザーの気になるオファー一覧を取得するエンドポイント
    """
    try:
        favorites = UserOffers().get_user_favorites(user_id)
        return {"status": "success", "favorites": favorites}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/offer/{offer_id}/applications/count")
async def get_offer_applications_count(offer_id: str, current_user: User = Depends(get_current_enterprise_user)):
    """
    特定のオファーの応募者数を取得するエンドポイント（企業ユーザー専用）
    """
    try:
        result = UserOffers().get_offer_applications_count(offer_id)
        if result["status"] == "ok":
            return {"status": "success", "count": result["count"]}
        else:
            raise HTTPException(status_code=500, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/offer/{offer_id}/applicants")
async def get_offer_applicants(offer_id: str, current_user: User = Depends(get_current_enterprise_user)):
    """
    特定のオファーの応募者一覧を取得するエンドポイント（企業ユーザー専用）
    """
    try:
        print(f"DEBUG: API endpoint called with offer_id: {offer_id}")
        print(f"DEBUG: Current user: {current_user.id}")
        result = UserOffers().get_offer_applicants(offer_id)
        print(f"DEBUG: Result from UserOffers: {result}")
        if result["status"] == "ok":
            return {"status": "success", "applicants": result["applicants"]}
        else:
            print(f"ERROR: UserOffers returned error: {result}")
            raise HTTPException(status_code=500, detail=result["error"])
    except Exception as e:
        print(f"ERROR: Exception in API endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/offer/assign")
async def assign_applicant(data: UserAssign, current_user: User = Depends(get_current_enterprise_user)):
    """
    応募者をオファーにアサインする（企業ユーザー専用）
    """
    try:
        result = UserOffers().assign_applicant(data.user_id, data.offer_id)
        if result["status"] == "ok":
            return {"status": "success", "message": result["message"]}
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))