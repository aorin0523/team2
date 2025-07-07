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
        
    def get_enterprise_by_id(self, enterprise_id: int):
        """
        指定されたIDの企業情報を1件取得する
        """
        with self.engine.connect() as conn:
            query = self.enterprises.select().where(self.enterprises.c.id == enterprise_id)
            result = conn.execute(query).first()
            return dict(result) if result else None

    def update_description(self, enterprise_id: int, description: str):
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
            # conn.commit()
            return {"updated_rows": result.rowcount}