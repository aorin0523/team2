from fastapi import APIRouter, HTTPException, Depends
from modules.db.notifications import Notifications
from auth.token import get_current_user, User
from pydantic import BaseModel

router = APIRouter()

class NotificationCreate(BaseModel):
    user_id: str
    type: str
    title: str
    message: str
    offer_id: str = None
    enterprise_name: str = None

class NotificationMarkRead(BaseModel):
    notification_id: str

@router.get("/{user_id}/notifications")
async def get_user_notifications(
    user_id: str, 
    limit: int = 50, 
    offset: int = 0,
    current_user: User = Depends(get_current_user)
):
    """
    ユーザーの通知一覧を取得するエンドポイント
    """
    try:
        # 自分の通知のみ取得可能
        if current_user.id != user_id:
            raise HTTPException(status_code=403, detail="他のユーザーの通知は取得できません")
        
        result = Notifications().get_user_notifications(user_id, limit, offset)
        
        if result["status"] == "ok":
            return {"status": "success", "notifications": result["notifications"]}
        else:
            raise HTTPException(status_code=500, detail=result["error"])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/notifications/unread-count")
async def get_unread_notifications_count(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ユーザーの未読通知数を取得するエンドポイント
    """
    try:
        # 自分の未読数のみ取得可能
        if current_user.id != user_id:
            raise HTTPException(status_code=403, detail="他のユーザーの未読数は取得できません")
        
        result = Notifications().get_unread_count(user_id)
        
        if result["status"] == "ok":
            return {"status": "success", "count": result["count"]}
        else:
            raise HTTPException(status_code=500, detail=result["error"])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/notifications/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    通知を既読にするエンドポイント
    """
    try:
        result = Notifications().mark_as_read(notification_id, current_user.id)
        
        if result["status"] == "ok":
            return {"status": "success", "message": result["message"]}
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}/notifications/mark-all-read")
async def mark_all_notifications_as_read(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ユーザーの全通知を既読にするエンドポイント
    """
    try:
        # 自分の通知のみ既読可能
        if current_user.id != user_id:
            raise HTTPException(status_code=403, detail="他のユーザーの通知は操作できません")
        
        result = Notifications().mark_all_as_read(user_id)
        
        if result["status"] == "ok":
            return {"status": "success", "message": result["message"]}
        else:
            raise HTTPException(status_code=500, detail=result["error"])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    通知を削除するエンドポイント
    """
    try:
        result = Notifications().delete_notification(notification_id, current_user.id)
        
        if result["status"] == "ok":
            return {"status": "success", "message": result["message"]}
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/notifications")
async def create_notification(
    data: NotificationCreate,
    current_user: User = Depends(get_current_user)
):
    """
    通知を作成するエンドポイント（管理者または企業ユーザー用）
    """
    try:
        # 企業ユーザーのみ通知作成可能（enterprise_idがある場合）
        if not current_user.enterprise_id:
            raise HTTPException(status_code=403, detail="通知の作成権限がありません")
        
        result = Notifications().create_notification(
            user_id=data.user_id,
            notification_type=data.type,
            title=data.title,
            message=data.message,
            offer_id=data.offer_id,
            enterprise_name=data.enterprise_name
        )
        
        if result["status"] == "ok":
            return {"status": "success", "notification_id": result["notification_id"]}
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/notifications")
async def get_notifications_by_user_id(user_id: str, limit: int = 50, offset: int = 0):
    """
    テスト用：認証なしで通知を取得するエンドポイント
    """
    try:
        result = Notifications().get_user_notifications(
            user_id=user_id,
            limit=limit,
            offset=offset
        )
        
        if result["status"] == "ok":
            return {
                "status": "success", 
                "notifications": result["notifications"],
                "total_count": result["total_count"],
                "unread_count": result["unread_count"]
            }
        else:
            return {"status": "error", "error": result["error"]}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@router.get("/test")
async def test_notifications():
    """
    デバッグ用テストエンドポイント
    """
    try:
        notifications_db = Notifications()
        
        # 直接SQLで確認
        with notifications_db.engine.connect() as conn:
            result = conn.execute("SELECT COUNT(*) FROM Notifications WHERE user_id = %s", 
                                ("00000000-0000-0000-0000-000000000000",))
            count = result.fetchone()[0]
            
        return {
            "status": "success", 
            "message": "Notifications class initialized successfully",
            "count": count
        }
    except Exception as e:
        import traceback
        return {
            "status": "error", 
            "error": str(e), 
            "type": type(e).__name__,
            "traceback": traceback.format_exc()
        }
