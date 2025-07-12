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
                    self.users.c.password,
                    self.users.c.enterprise_id
                ).where(self.users.c.email == email)
                
                result = conn.execute(stmt).mappings().first()
                return dict(result) if result else None
        except Exception as e:
            return None

    def authenticate_user(self, email: str, password: str):
        """ユーザー認証"""
        print(f"Authenticating user with email: {email}")
        user = self.get_user_by_email(email)
        if not user:
            print(f"User not found for email: {email}")
            return False
        if not self.verify_password(password, user["password"]):
            print(f"Password verification failed for email: {email}")
            return False
        print(f"Authentication successful for email: {email}")
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
        
    def create_user(self, name, email, password, rank=1, enterprise_id=None):
        """
        ユーザーを追加する（パスワードをハッシュ化）
        一般ユーザーまたは企業ユーザーを作成可能
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
                    password=hashed_password,
                    rank=rank,
                    enterprise_id=enterprise_id
                )
                conn.execute(query)
                conn.commit()
                return {"user_id": id, "status": "ok"}
        except Exception as e:
            return {"status": "ng", "error": str(e)}
    
    def create_enterprise_user(self, name, email, password, enterprise_id, rank=1):
        """
        企業用ユーザーを作成する
        """
        # 企業IDの存在確認
        try:
            with self.engine.connect() as conn:
                enterprise_check = conn.execute(
                    self.enterprises.select().where(self.enterprises.c.id == enterprise_id)
                ).mappings().first()
                
                if not enterprise_check:
                    return {"status": "ng", "error": "Enterprise not found"}
        except Exception as e:
            return {"status": "ng", "error": f"Enterprise validation error: {str(e)}"}
        
        # 企業ユーザー作成
        return self.create_user(
            name=name,
            email=email,
            password=password,
            rank=rank,
            enterprise_id=enterprise_id
        )
    
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
