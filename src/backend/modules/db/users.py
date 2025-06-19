from modules.db import BaseDB
import uuid

class Users(BaseDB): 
    def __init__(self):
        super().__init__()

    def get_all_users(self):
        """
        ユーザ情報を全件取得する
        """
        with self.engine.connect() as conn:
            query = self.users.select()
            result = conn.execute(query)
            return [dict(row) for row in result.mappings()]
        
    def get_users(self):
        """
        ユーザ情報を全件取得する
        """
        with self.engine.connect() as conn:
            query = self.users.select()
            result = conn.execute(query)
            return [dict(row) for row in result.mappings()]
        
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
                    password=password
                )
                conn.execute(query)
                conn.commit()
                return {"user_id":id, "status": "ok"}
        except Exception as e:
            return {"status": "ng", "error": e}
    
    def update_user(self, id, name=None, email=None, password=None):
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