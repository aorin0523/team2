from modules.db import BaseDB
from sqlalchemy import select, insert, update, delete
from datetime import datetime
import uuid

class UserOffers(BaseDB):
    def __init__(self):
        super().__init__()
        
    def apply_to_offer(self, user_id: str, offer_id: str):
        """
        ユーザーがオファーに応募する（wishをTrueに設定）
        """
        try:
            with self.engine.begin() as conn:  # beginを使ってトランザクションを明示的に開始
                # 既存のレコードをチェック
                check_stmt = select(self.user_offers).where(
                    (self.user_offers.c.user_id == user_id) &
                    (self.user_offers.c.offer_id == offer_id)
                )
                existing = conn.execute(check_stmt).mappings().first()
                
                if existing:
                    # 既存のレコードがある場合は更新
                    update_stmt = update(self.user_offers).where(
                        (self.user_offers.c.user_id == user_id) &
                        (self.user_offers.c.offer_id == offer_id)
                    ).values(
                        wish=True,
                        updated_at=datetime.now()
                    )
                    conn.execute(update_stmt)
                else:
                    # 新しいレコードを作成
                    insert_stmt = insert(self.user_offers).values(
                        user_id=user_id,
                        offer_id=offer_id,
                        wish=True,
                        favorite=False,
                        assign=False,
                        created_at=datetime.now()
                    )
                    conn.execute(insert_stmt)
                
                return {"status": "ok", "message": "応募が完了しました"}
                
        except Exception as e:
            return {"status": "ng", "error": str(e)}
    
    def check_application_status(self, user_id: str, offer_id: str):
        """
        ユーザーの応募状況をチェック
        """
        try:
            with self.engine.connect() as conn:
                stmt = select(self.user_offers).where(
                    (self.user_offers.c.user_id == user_id) &
                    (self.user_offers.c.offer_id == offer_id)
                )
                result = conn.execute(stmt).mappings().first()
                
                if result:
                    return {
                        "status": "ok",
                        "applied": bool(result["wish"]),
                        "favorite": bool(result["favorite"]),
                        "assigned": bool(result["assign"])
                    }
                else:
                    return {
                        "status": "ok",
                        "applied": False,
                        "favorite": False,
                        "assigned": False
                    }
                    
        except Exception as e:
            return {"status": "ng", "error": str(e)}
    
    def get_user_applications(self, user_id: str):
        """
        ユーザーの応募一覧を取得
        """
        try:
            with self.engine.connect() as conn:
                stmt = select(
                    self.user_offers,
                    self.offers.c.title.label("offer_title"),
                    self.enterprises.c.name.label("enterprise_name")
                ).select_from(
                    self.user_offers.join(
                        self.offers, self.user_offers.c.offer_id == self.offers.c.id
                    ).join(
                        self.enterprises, self.offers.c.enterprise_id == self.enterprises.c.id
                    )
                ).where(
                    (self.user_offers.c.user_id == user_id) &
                    (self.user_offers.c.wish == True)
                )
                
                result = conn.execute(stmt).mappings().all()
                return {"status": "ok", "applications": list(result)}
                
        except Exception as e:
            return {"status": "ng", "error": str(e)}

    def toggle_favorite(self, user_id: str, offer_id: str):
        """
        ユーザーのお気に入り状態を切り替え
        """
        try:
            with self.engine.begin() as conn:  # beginを使ってトランザクションを明示的に開始
                # 既存のレコードをチェック
                check_stmt = select(self.user_offers).where(
                    (self.user_offers.c.user_id == user_id) &
                    (self.user_offers.c.offer_id == offer_id)
                )
                existing = conn.execute(check_stmt).mappings().first()
                
                if existing:
                    # 既存のレコードがある場合は favorite の状態を切り替え
                    current_favorite = bool(existing["favorite"])
                    new_favorite_status = not current_favorite
                    
                    update_stmt = update(self.user_offers).where(
                        (self.user_offers.c.user_id == user_id) &
                        (self.user_offers.c.offer_id == offer_id)
                    ).values(
                        favorite=new_favorite_status,
                        updated_at=datetime.now()
                    )
                    conn.execute(update_stmt)
                else:
                    # 新しいレコードを作成（favoriteをTrueに設定）
                    insert_stmt = insert(self.user_offers).values(
                        user_id=user_id,
                        offer_id=offer_id,
                        wish=False,
                        favorite=True,
                        assign=False,
                        created_at=datetime.now()
                    )
                    conn.execute(insert_stmt)
                
                return {"status": "ok", "message": "お気に入り状態を更新しました"}
                
        except Exception as e:
            return {"status": "ng", "error": str(e)}

    def get_user_favorites(self, user_id: str):
        """
        ユーザーのお気に入りオファー一覧を取得
        """
        try:
            with self.engine.connect() as conn:
                stmt = select(
                    self.user_offers,
                    self.offers.c.title.label("offer_title"),
                    self.enterprises.c.name.label("enterprise_name")
                ).select_from(
                    self.user_offers.join(
                        self.offers, self.user_offers.c.offer_id == self.offers.c.id
                    ).join(
                        self.enterprises, self.offers.c.enterprise_id == self.enterprises.c.id
                    )
                ).where(
                    (self.user_offers.c.user_id == user_id) &
                    (self.user_offers.c.favorite == True)
                )
                
                result = conn.execute(stmt).mappings().all()
                return {"status": "ok", "favorites": list(result)}
                
        except Exception as e:
            return {"status": "ng", "error": str(e)}
