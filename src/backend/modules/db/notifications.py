from modules.db import BaseDB
from sqlalchemy import select, update, delete, and_
import uuid
from datetime import datetime, timezone, timedelta

# 日本時間のタイムゾーンを定義
JST = timezone(timedelta(hours=9))

class Notifications(BaseDB):
    def __init__(self):
        super().__init__()

    def get_user_notifications(self, user_id, limit=50, offset=0):
        """
        ユーザーの通知一覧を取得（新着順）
        """
        try:
            with self.engine.connect() as conn:
                # まずはシンプルにテスト
                stmt = select(
                    self.notifications.c.id,
                    self.notifications.c.type,
                    self.notifications.c.title,
                    self.notifications.c.message,
                    self.notifications.c.offer_id,
                    self.notifications.c.enterprise_name,
                    self.notifications.c.is_read,
                    self.notifications.c.created_at
                ).where(
                    self.notifications.c.user_id == user_id
                ).order_by(
                    self.notifications.c.created_at.desc()
                ).limit(limit).offset(offset)
                
                result = conn.execute(stmt).fetchall()
                notifications = []
                for row in result:
                    notifications.append({
                        'id': row[0],
                        'type': row[1], 
                        'title': row[2],
                        'message': row[3],
                        'offer_id': row[4],
                        'enterprise_name': row[5],
                        'is_read': bool(row[6]),
                        'created_at': row[7].isoformat() if row[7] else None
                    })
                
                # 総数と未読数も取得
                total_count_stmt = select(self.notifications.c.id).where(
                    self.notifications.c.user_id == user_id
                )
                total_result = conn.execute(total_count_stmt).fetchall()
                total_count = len(total_result)
                
                unread_count_stmt = select(self.notifications.c.id).where(
                    and_(
                        self.notifications.c.user_id == user_id,
                        self.notifications.c.is_read == False
                    )
                )
                unread_result = conn.execute(unread_count_stmt).fetchall()
                unread_count = len(unread_result)
                
                return {
                    "status": "ok", 
                    "notifications": notifications,
                    "total_count": total_count,
                    "unread_count": unread_count
                }
        except Exception as e:
            import traceback
            return {"status": "ng", "error": str(e), "traceback": traceback.format_exc()}

    def get_unread_count(self, user_id):
        """
        ユーザーの未読通知数を取得
        """
        try:
            with self.engine.connect() as conn:
                stmt = select(
                    self.notifications.c.id
                ).where(
                    and_(
                        self.notifications.c.user_id == user_id,
                        self.notifications.c.is_read == False
                    )
                )
                
                result = conn.execute(stmt).mappings().all()
                count = len(result)
                
                return {"status": "ok", "count": count}
        except Exception as e:
            return {"status": "ng", "error": str(e)}

    def mark_as_read(self, notification_id, user_id):
        """
        通知を既読にする
        """
        try:
            with self.engine.connect() as conn:
                stmt = update(self.notifications).where(
                    and_(
                        self.notifications.c.id == notification_id,
                        self.notifications.c.user_id == user_id
                    )
                ).values(
                    is_read=True,
                    updated_at=datetime.now(JST)
                )
                
                result = conn.execute(stmt)
                conn.commit()
                
                if result.rowcount > 0:
                    return {"status": "ok", "message": "通知を既読にしました"}
                else:
                    return {"status": "ng", "error": "通知が見つからないか、権限がありません"}
        except Exception as e:
            return {"status": "ng", "error": str(e)}

    def mark_all_as_read(self, user_id):
        """
        ユーザーの全通知を既読にする
        """
        try:
            with self.engine.connect() as conn:
                stmt = update(self.notifications).where(
                    and_(
                        self.notifications.c.user_id == user_id,
                        self.notifications.c.is_read == False
                    )
                ).values(
                    is_read=True,
                    updated_at=datetime.now(JST)
                )
                
                result = conn.execute(stmt)
                conn.commit()
                
                return {"status": "ok", "message": f"{result.rowcount}件の通知を既読にしました"}
        except Exception as e:
            return {"status": "ng", "error": str(e)}

    def create_notification(self, user_id, notification_type, title, message, offer_id=None, enterprise_name=None):
        """
        新しい通知を作成
        """
        try:
            with self.engine.connect() as conn:
                notification_id = str(uuid.uuid4())
                
                stmt = self.notifications.insert().values(
                    id=notification_id,
                    user_id=user_id,
                    type=notification_type,
                    title=title,
                    message=message,
                    offer_id=offer_id,
                    enterprise_name=enterprise_name,
                    is_read=False,
                    created_at=datetime.now(JST)
                )
                
                conn.execute(stmt)
                conn.commit()
                
                return {"status": "ok", "notification_id": notification_id}
        except Exception as e:
            return {"status": "ng", "error": str(e)}

    def delete_notification(self, notification_id, user_id):
        """
        通知を削除
        """
        try:
            with self.engine.connect() as conn:
                stmt = delete(self.notifications).where(
                    and_(
                        self.notifications.c.id == notification_id,
                        self.notifications.c.user_id == user_id
                    )
                )
                
                result = conn.execute(stmt)
                conn.commit()
                
                if result.rowcount > 0:
                    return {"status": "ok", "message": "通知を削除しました"}
                else:
                    return {"status": "ng", "error": "通知が見つからないか、権限がありません"}
        except Exception as e:
            return {"status": "ng", "error": str(e)}

    def create_assignment_notification(self, user_id, offer_title, enterprise_name, offer_id):
        """
        アサイン通知を作成するヘルパーメソッド
        """
        return self.create_notification(
            user_id=user_id,
            notification_type="assignment",
            title=offer_title,
            message="あなたがこのプロジェクトにアサインされました\n担当者からの連絡をお待ち下さい",
            offer_id=offer_id,
            enterprise_name=enterprise_name
        )

    def create_application_update_notification(self, user_id, offer_title, enterprise_name, offer_id, status):
        """
        応募状況更新通知を作成するヘルパーメソッド
        """
        message_map = {
            "accepted": "応募が承認されました",
            "rejected": "応募が不承認となりました",
            "pending": "応募状況が更新されました"
        }
        
        return self.create_notification(
            user_id=user_id,
            notification_type="application_update",
            title=offer_title,
            message=message_map.get(status, "応募状況が更新されました"),
            offer_id=offer_id,
            enterprise_name=enterprise_name
        )
