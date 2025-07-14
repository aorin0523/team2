from modules.db import BaseDB
from sqlalchemy import outerjoin, select
import uuid
from datetime import datetime

class Offers(BaseDB):
    def __init__(self):
        super().__init__()
        
    def read_all_offers(self):
        """
        オファーを全件取得
        """
        with self.engine.connect() as conn:
            j1 = outerjoin(self.offers, self.enterprises, self.offers.c.enterprise_id == self.enterprises.c.id)
            j2 = outerjoin(j1, self.offer_skills, self.offers.c.id == self.offer_skills.c.offer_id)
            j3 = outerjoin(j2, self.skills, self.offer_skills.c.skill_id == self.skills.c.id)
            j4 = outerjoin(j3, self.ranks, self.offers.c.rank == self.ranks.c.id)

            stmt = select(
                self.offers.c.id.label("offer_id"),
                self.enterprises.c.name.label("enterprise_name"),
                self.offers.c.title.label("offer_title"),
                self.offers.c.content.label("offer_content"),
                self.offers.c.deadline.label("deadline"),
                self.offers.c.salary.label("salary"),
                self.offers.c.capacity.label("capacity"),
                self.ranks.c.name.label("rank"),
                self.skills.c.name.label("skill_name")
            ).select_from(j4)

            result = conn.execute(stmt).mappings().all()

            if not result:
                return []

            offer_dict = {}
            
            for row in result:
                offer_id = row["offer_id"]
                if offer_id not in offer_dict:                    offer_dict[offer_id] = {
                        "offer_id": offer_id,
                        "enterprise_name": row["enterprise_name"],
                        "offer_title": row["offer_title"],
                        "offer_content": row["offer_content"],
                        "deadline": row["deadline"],
                        "salary": row["salary"],
                        "capacity": row["capacity"],
                        "rank": row["rank"],
                        "skills": []
                    }

                # skill追加
                if row["skill_name"] and row["skill_name"] not in offer_dict[offer_id]["skills"]:
                    offer_dict[offer_id]["skills"].append(row["skill_name"])
            print()

            return list(offer_dict.values())
    
    
    def read_offers(self, id):
        """
        オファーを個別取得
        """
        with self.engine.connect() as conn:
            print("offerrrrrr")
            j1 = outerjoin(self.offers, self.enterprises, self.offers.c.enterprise_id == self.enterprises.c.id)
            j2 = outerjoin(j1, self.offer_skills, self.offers.c.id == self.offer_skills.c.offer_id)
            j3 = outerjoin(j2, self.skills, self.offer_skills.c.skill_id == self.skills.c.id)
            j4 = outerjoin(j3, self.ranks, self.offers.c.rank == self.ranks.c.id)

            stmt = select(
                self.offers.c.id.label("offer_id"),
                self.enterprises.c.name.label("enterprise_name"),
                self.offers.c.title.label("offer_title"),
                self.offers.c.content.label("offer_content"),
                self.offers.c.deadline.label("deadline"),
                self.offers.c.salary.label("salary"),
                self.offers.c.capacity.label("capacity"),
                self.ranks.c.name.label("rank"),
                self.skills.c.name.label("skill_name")
            ).select_from(j4).where(self.offers.c.id == id)

            result = conn.execute(stmt).mappings().all()

            if not result:
                return []

            offer_dict = {}

            for row in result:
                offer_id = row["offer_id"]
                if offer_id not in offer_dict:                    offer_dict[offer_id] = {
                        "enterprise_name": row["enterprise_name"],
                        "offer_title": row["offer_title"],
                        "offer_content": row["offer_content"],
                        "deadline": row["deadline"],
                        "salary": row["salary"],
                        "capacity": row["capacity"],
                        "rank": row["rank"],
                        "skills": []
                    }
                # skill追加
                if row["skill_name"] and row["skill_name"] not in offer_dict[offer_id]["skills"]:
                    offer_dict[offer_id]["skills"].append(row["skill_name"])

            return list(offer_dict.values())[0]
    
    def create_offer(self, enterprise_id, title, content, rank, skills, deadline, salary=None, capacity=None):
        """
        オファーを追加する
        """
        id = uuid.uuid4()
        try:
            with self.engine.connect() as conn:
                offer_values = {
                    "id": id,
                    "enterprise_id": enterprise_id,
                    "title": title,
                    "content": content,
                    "rank": rank,
                }
                
                if salary is not None:
                    offer_values["salary"] = salary
                if capacity is not None:
                    offer_values["capacity"] = capacity
                if deadline is not None:
                    offer_values["deadline"] = deadline
                
                offer_query = self.offers.insert().values(**offer_values)
                conn.execute(offer_query)
                
                for skill in skills:
                    offerSkill_query = self.offer_skills.insert().values(
                        offer_id=id,
                        skill_id=skill
                    )
                    conn.execute(offerSkill_query)

                conn.commit()
                return {"status": "ok", "offer_id": str(id)}
        except Exception as e:
            return {"status": "ng", "error": str(e)}
        
    
    def update_offer(self, offer_id, title, content, rank, skills, salary=None, capacity=None):
        try:
            print(offer_id, title, content, rank, skills, salary, capacity)
            with self.engine.connect() as conn:
                update_values = {}
                update_values["deadline"] = datetime.now()
                if title is not None:
                    update_values["title"] = title
                if content is not None:
                    update_values["content"] = content
                if rank is not None:
                    update_values["rank"] = rank
                if salary is not None:
                    update_values["salary"] = salary
                if capacity is not None:
                    update_values["capacity"] = capacity
                
                # オファーの編集
                offer_query = self.offers.update().where(
                    self.offers.c.id==offer_id
                ).values(**update_values)
                conn.execute(offer_query)
                
                # オファーのスキルの編集
                # 一旦offer_idに紐づくskill_idを削除
                delete_query = self.offer_skills.delete().where(
                    self.offer_skills.c.offer_id==offer_id
                )
                conn.execute(delete_query)
                # 新しいskill_idを追加
                for skill in skills:
                    offerSkill_query = self.offer_skills.insert().values(
                        offer_id=offer_id,
                        skill_id=skill
                    )
                    conn.execute(offerSkill_query)
                conn.commit()
                return {"status": "ok"}
        
        except Exception as e:
            return {"status": "ng", "error": str(e)}
    
    
    def delete_offer(self, offer_id):
        """
        オファーを削除
        """
        try:
            with self.engine.connect() as conn:
                query = self.offers.delete().where(
                    self.offers.c.id==offer_id
                )
                
                conn.execute(query)
                conn.commit()
                return {"status": "ok"}
        except Exception as e:
            return {"status": "ng", "error": str(e)}
    
    def get_offers_by_enterprise(self, enterprise_id: str):
        """
        企業IDでオファーを取得
        """
        with self.engine.connect() as conn:
            j1 = outerjoin(self.offers, self.enterprises, self.offers.c.enterprise_id == self.enterprises.c.id)
            j2 = outerjoin(j1, self.offer_skills, self.offers.c.id == self.offer_skills.c.offer_id)
            j3 = outerjoin(j2, self.skills, self.offer_skills.c.skill_id == self.skills.c.id)
            j4 = outerjoin(j3, self.ranks, self.offers.c.rank == self.ranks.c.id)

            stmt = select(
                self.offers.c.id.label("offer_id"),
                self.enterprises.c.name.label("enterprise_name"),
                self.offers.c.title.label("offer_title"),
                self.offers.c.content.label("offer_content"),
                self.offers.c.deadline.label("deadline"),
                self.offers.c.salary.label("salary"),
                self.offers.c.capacity.label("capacity"),
                self.ranks.c.name.label("rank"),
                self.skills.c.name.label("skill_name")
            ).select_from(j4).where(self.offers.c.enterprise_id == enterprise_id)

            result = conn.execute(stmt).mappings().all()

            if not result:
                return []

            offer_dict = {}

            for row in result:
                offer_id = row["offer_id"]
                if offer_id not in offer_dict:
                    offer_dict[offer_id] = {
                        "offer_id": offer_id,
                        "enterprise_name": row["enterprise_name"],
                        "offer_title": row["offer_title"],
                        "offer_content": row["offer_content"],
                        "deadline": row["deadline"],
                        "salary": row["salary"],
                        "capacity": row["capacity"],
                        "rank": row["rank"],
                        "skills": []
                    }

                # skill追加
                if row["skill_name"] and row["skill_name"] not in offer_dict[offer_id]["skills"]:
                    offer_dict[offer_id]["skills"].append(row["skill_name"])

            return list(offer_dict.values())