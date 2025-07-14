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

    def get_offer_applications_count(self, offer_id: str):
        """
        特定のオファーの応募者数を取得
        """
        try:
            print(f"Getting applications count for offer_id: {offer_id}")
            with self.engine.connect() as conn:
                from sqlalchemy import func
                stmt = select(func.count(self.user_offers.c.user_id)).where(
                    (self.user_offers.c.offer_id == offer_id) &
                    (self.user_offers.c.wish == True)
                )
                
                print(f"SQL query: {stmt}")
                result = conn.execute(stmt).scalar()
                print(f"Count result: {result}")
                return {"status": "ok", "count": result or 0}
                
        except Exception as e:
            print(f"Error in get_offer_applications_count: {str(e)}")
            return {"status": "ng", "error": str(e)}

    def get_offer_applicants(self, offer_id: str):
        """
        特定のオファーの応募者一覧を取得（DBアクセス最適化版）
        """
        try:
            print(f"DEBUG: Getting applicants for offer_id: {offer_id}")
            with self.engine.connect() as conn:
                # Step 1: UserOffersから応募者情報を取得
                user_offers_stmt = select(
                    self.user_offers.c.user_id,
                    self.user_offers.c.created_at.label("applied_at"),
                    self.user_offers.c.assign.label("is_assigned")
                ).where(
                    (self.user_offers.c.offer_id == offer_id) &
                    (self.user_offers.c.wish == True)
                )
                
                print(f"DEBUG: Executing user_offers query")
                user_offers_result = conn.execute(user_offers_stmt).mappings().all()
                print(f"DEBUG: Found {len(user_offers_result)} user_offers records")
                
                if not user_offers_result:
                    print("DEBUG: No applicants found")
                    return {"status": "ok", "applicants": []}
                
                # 応募者のuser_idリストを取得
                user_ids = [row["user_id"] for row in user_offers_result]
                print(f"DEBUG: User IDs: {user_ids}")
                
                # user_offersの情報を辞書化（後で参照用）
                user_offers_map = {
                    row["user_id"]: {
                        "applied_at": row["applied_at"],
                        "is_assigned": row["is_assigned"]
                    }
                    for row in user_offers_result
                }
                
                # Step 2: ユーザー情報を一括取得
                users_stmt = select(
                    self.users.c.id.label("user_id"),
                    self.users.c.name.label("name"),
                    self.users.c.email.label("email")
                ).where(self.users.c.id.in_(user_ids))
                
                print(f"DEBUG: Executing users query")
                users_result = conn.execute(users_stmt).mappings().all()
                print(f"DEBUG: Found {len(users_result)} users records")
                
                # ユーザー情報を辞書化
                users_map = {
                    row["user_id"]: {
                        "name": row["name"],
                        "email": row["email"],
                        "school": "未設定",  # schoolフィールドは存在しないため固定値
                        "major": "未設定"    # majorフィールドは存在しないため固定値
                    }
                    for row in users_result
                }
                
                # Step 3: 全ユーザーのスキル情報を一括取得
                skills_stmt = select(
                    self.user_skills.c.user_id,
                    self.skills.c.name.label("skill_name")
                ).select_from(
                    self.user_skills.join(
                        self.skills, self.user_skills.c.skill_id == self.skills.c.id
                    )
                ).where(self.user_skills.c.user_id.in_(user_ids))
                
                print(f"DEBUG: Executing skills query")
                skills_result = conn.execute(skills_stmt).mappings().all()
                print(f"DEBUG: Found {len(skills_result)} skills records")
                
                # ユーザーIDごとにスキルをグループ化
                skills_map = {}
                for row in skills_result:
                    user_id = row["user_id"]
                    if user_id not in skills_map:
                        skills_map[user_id] = []
                    skills_map[user_id].append(row["skill_name"])
                
                # Step 4: 応募者データを組み立て
                applicants = []
                for user_id in user_ids:
                    user_info = users_map.get(user_id)
                    if not user_info:
                        print(f"DEBUG: User {user_id} not found in users table")
                        continue  # ユーザーが見つからない場合はスキップ
                    
                    offer_info = user_offers_map[user_id]
                    skills = skills_map.get(user_id, [])
                    
                    # 応募状況を判定
                    status = "assigned" if offer_info["is_assigned"] else "pending"
                    
                    applicant = {
                        "user_id": user_id,
                        "name": user_info["name"],
                        "email": user_info["email"],
                        "school": user_info["school"],
                        "major": user_info["major"],
                        "skills": skills,
                        "applied_at": offer_info["applied_at"].isoformat() if offer_info["applied_at"] else None,
                        "status": status
                    }
                    applicants.append(applicant)
                
                print(f"DEBUG: Built {len(applicants)} applicant records")
                return {"status": "ok", "applicants": applicants}
                
        except Exception as e:
            print(f"ERROR in get_offer_applicants: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"status": "ng", "error": str(e)}
    
    def assign_applicant(self, user_id: str, offer_id: str):
        """
        応募者をアサインする（assignをTrueに設定）
        """
        try:
            with self.engine.begin() as conn:
                # 応募者が存在し、wish=Trueであることを確認
                check_stmt = select(self.user_offers).where(
                    (self.user_offers.c.user_id == user_id) &
                    (self.user_offers.c.offer_id == offer_id) &
                    (self.user_offers.c.wish == True)
                )
                existing = conn.execute(check_stmt).mappings().first()
                
                if not existing:
                    return {"status": "ng", "error": "応募記録が見つかりません"}
                
                # assignをTrueに更新
                update_stmt = update(self.user_offers).where(
                    (self.user_offers.c.user_id == user_id) &
                    (self.user_offers.c.offer_id == offer_id)
                ).values(
                    assign=True,
                    updated_at=datetime.now()
                )
                conn.execute(update_stmt)
                
                return {"status": "ok", "message": "応募者をアサインしました"}
                
        except Exception as e:
            return {"status": "ng", "error": str(e)}
    
    def assign_user_to_offer(self, user_id: str, offer_id: str):
        """
        ユーザーをオファーにアサインする
        """
        try:
            with self.engine.begin() as conn:
                # 既存のレコードをチェック
                check_stmt = select(self.user_offers).where(
                    (self.user_offers.c.user_id == user_id) &
                    (self.user_offers.c.offer_id == offer_id)
                )
                existing = conn.execute(check_stmt).mappings().first()
                
                if existing:
                    # 既存のレコードがある場合はassignをTrueに更新
                    update_stmt = update(self.user_offers).where(
                        (self.user_offers.c.user_id == user_id) &
                        (self.user_offers.c.offer_id == offer_id)
                    ).values(
                        assign=True,
                        updated_at=datetime.now()
                    )
                    conn.execute(update_stmt)
                else:
                    # レコードが存在しない場合はエラー
                    return {"status": "ng", "error": "応募記録が見つかりません"}
                
                return {"status": "ok", "message": "ユーザーをアサインしました"}
                
        except Exception as e:
            return {"status": "ng", "error": str(e)}
