from modules.db import BaseDB
from sqlalchemy import update

class Enterprises(BaseDB): 
    def __init__(self):
        super().__init__()

    def get_all_enterprises(self):
        """
        企業情報を全件取得する
        """
        with self.engine.connect() as conn:
            query = self.enterprises.select()
            result = conn.execute(query)
            return [dict(row) for row in result.mappings()]
        
    def get_enterprise_by_id(self, enterprise_id: str):
        """
        指定されたIDの企業情報を1件取得する
        """
        with self.engine.connect() as conn:
            query = self.enterprises.select().where(self.enterprises.c.id == enterprise_id)
            # .first() の前に .mappings() を追加して、結果を辞書形式で取得する
            result = conn.execute(query).mappings().first()
            return result

    def update_description(self, enterprise_id: str, description: str):
        """
        企業のdescriptionを更新する
        """
        with self.engine.connect() as conn:
            query = (
                update(self.enterprises)
                .where(self.enterprises.c.id == enterprise_id)
                .values(description=description)
            )
            result = conn.execute(query)
            return {"updated_rows": result.rowcount}