from modules.db import BaseDB

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
