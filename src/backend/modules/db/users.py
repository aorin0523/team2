from modules.db import BaseDB
from sqlalchemy import outerjoin, select
import uuid

class Users(BaseDB): 
    def __init__(self):
        super().__init__()

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
        ユーザーを追加する
        """
        id = uuid.uuid4()
        try:
            with self.engine.connect() as conn:
                query = self.users.insert().values(
                    id=id,
                    name=name,
                    email=email,
                    password=password,
                    rank = 1
                )
                conn.execute(query)
                conn.commit()
                return {"user_id":id, "status": "ok"}
        except Exception as e:
            return {"status": "ng", "error": e}
    
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
                    update_values["password"] = password
                if rank is not None:
                    update_values["rank"] = rank
                
                query = self.users.update().where(
                    self.users.c.id==id
                ).values(**update_values)
                
                conn.execute(query)
                conn.commit()
                return {"status": "ok"}
        except Exception as e:
            return {"status": "ng", "error": e}

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
            return {"status": "ng", "error": e}