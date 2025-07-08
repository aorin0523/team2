from modules.db import BaseDB
from sqlalchemy import outerjoin, select
from passlib.context import CryptContext
import uuid

# パスワードハッシュ化のコンテキストを追加
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Users(BaseDB): 
    def __init__(self):
        super().__init__()

    def verify_password(self, plain_password, hashed_password):
        """パスワードを検証"""
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        """パスワードをハッシュ化"""
        return pwd_context.hash(password)

    def get_user_by_email(self, email: str):
        """emailでユーザーを取得（認証用）"""
        try:
            with self.engine.connect() as conn:
                stmt = select(
                    self.users.c.id,
                    self.users.c.name,
                    self.users.c.email,
                    self.users.c.password
                ).where(self.users.c.email == email)
                
                result = conn.execute(stmt).mappings().first()
                return dict(result) if result else None
        except Exception as e:
            return None

    def authenticate_user(self, email: str, password: str):
        """ユーザー認証"""
        user = self.get_user_by_email(email)
        if not user:
            return False
        if not self.verify_password(password, user["password"]):
            return False
        return user

    def get_all_users(self):
        with self.engine.connect() as conn:
            j1 = outerjoin(self.users, self.user_skills, self.users.c.id == self.user_skills.c.user_id)
            j2 = outerjoin(j1, self.skills, self.user_skills.c.skill_id == self.skills.c.id)
            j3 = outerjoin(j2, self.ranks, self.users.c.rank == self.ranks.c.id)

            stmt = select(
                self.users.c.id.label("user_id"),
                self.users.c.name.label("user_name"),
                self.users.c.email.label("email"),
                self.skills.c.name.label("skill_name"),
                self.ranks.c.name.label("rank")
            ).select_from(j3)

            result = conn.execute(stmt).mappings().all()

            if not result:
                return []

            users_dict = {}

            for row in result:
                user_id = row["user_id"]
                if user_id not in users_dict:
                    users_dict[user_id] = {
                        "user_id": user_id,
                        "user_name": row["user_name"],
                        "email": row["email"],
                        "rank": row["rank"],
                        "skills": []
                    }

                # skill追加
                if row["skill_name"] and row["skill_name"] not in users_dict[user_id]["skills"]:
                    users_dict[user_id]["skills"].append(row["skill_name"])

            return list(users_dict.values())

    def get_users(self, id):
        """
        ユーザ情報を取得する
        """
        try:
            with self.engine.connect() as conn:
                j1 = outerjoin(self.users, self.user_skills, self.users.c.id == self.user_skills.c.user_id)
                j2 = outerjoin(j1, self.skills, self.user_skills.c.skill_id == self.skills.c.id)
                j3 = outerjoin(j2, self.ranks, self.users.c.rank == self.ranks.c.id)
                stmt = select(
                    self.users.c.id.label("user_id"),
                    self.users.c.name.label("user_name"),
                    self.users.c.email.label("email"),
                    self.skills.c.name.label("skill_name"),
                    self.ranks.c.name.label("rank")
                ).select_from(j3).where(self.users.c.id == id)
                
                result = conn.execute(stmt).mappings()
                
                if not result:
                    return []
                
                users_dict = {}
                
                for row in result:
                    user_id = row["user_id"]
                    if user_id not in users_dict:
                        users_dict[user_id] = {
                            "user_id": user_id,
                            "user_name": row["user_name"],
                            "email": row["email"],
                            "rank": row["rank"],
                            "skills": []
                        }
                    
                    # skill追加
                    if row["skill_name"] and row["skill_name"] not in users_dict[user_id]["skills"]:
                        users_dict[user_id]["skills"].append(row["skill_name"])
                
                # [0]でリスト外す
                return list(users_dict.values())[0]
        except Exception as e:
            return {"status":"ng", "error": str(e)}
        
    def create_user(self, name, email, password):
        """
        ユーザーを追加する（パスワードをハッシュ化）
        """
        # メールアドレスの重複チェック
        existing_user = self.get_user_by_email(email)
        if existing_user:
            return {"status": "ng", "error": "Email already exists"}
        
        id = str(uuid.uuid4())
        hashed_password = self.get_password_hash(password)
        
        try:
            with self.engine.connect() as conn:
                query = self.users.insert().values(
                    id=id,
                    name=name,
                    email=email,
                    password=hashed_password
                )
                conn.execute(query)
                conn.commit()
                return {"user_id": id, "status": "ok"}
        except Exception as e:
            return {"status": "ng", "error": str(e)}
    
    def update_user(self, id, name, email, password, rank):
        """
        ユーザー情報をアップデート
        """
        try:
            with self.engine.connect() as conn:
                update_values = {}
                if name is not None:
                    update_values["name"] = name
                if email is not None:
                    update_values["email"] = email
                if password is not None:
                    # パスワードを更新する場合はハッシュ化する
                    update_values["password"] = self.get_password_hash(password)
                if rank is not None:
                    update_values["rank"] = rank
                
                query = self.users.update().where(
                    self.users.c.id==id
                ).values(**update_values)
                
                conn.execute(query)
                conn.commit()
                return {"status": "ok"}
        except Exception as e:
            return {"status": "ng", "error": str(e)}

    def delete_user(self, id):
        """
        ユーザー情報を削除
        """
        try:
            with self.engine.connect() as conn:
                query = self.users.delete().where(
                    self.users.c.id==id
                )
                
                conn.execute(query)
                conn.commit()
                return {"status": "ok"}
        except Exception as e:
            return {"status": "ng", "error": str(e)}
