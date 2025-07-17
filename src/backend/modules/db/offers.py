from modules.db import BaseDB
from sqlalchemy import outerjoin, select, func
import uuid
from datetime import datetime, timezone, timedelta

# 日本時間のタイムゾーンを定義
JST = timezone(timedelta(hours=9))

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
    
    def read_offers(self, id):
        """
        オファーを個別取得
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
            ).select_from(j4).where(self.offers.c.id == id)

            result = conn.execute(stmt).mappings().all()

            if not result:
                return []

            offer_dict = {}

            for row in result:
                offer_id = row["offer_id"]
                if offer_id not in offer_dict:
                    offer_dict[offer_id] = {
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

    def create_offer(self, enterprise_id, title, content, rank, skills, salary=None, capacity=None, deadline=None):
        """
        オファーを追加する
        """
        id = uuid.uuid4()
        try:
            print(f"=== Database: Creating offer ===")
            print(f"ID: {id}")
            print(f"Enterprise ID: {enterprise_id}")
            print(f"Title: {title}")
            print(f"Content length: {len(content) if content else 0}")
            print(f"Rank: {rank}")
            print(f"Skills: {skills}")
            print(f"Salary: {salary}")
            print(f"Capacity: {capacity}")
            print(f"Deadline: {deadline}")
            
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
                
                print(f"Inserting offer with values: {offer_values}")
                offer_query = self.offers.insert().values(**offer_values)
                conn.execute(offer_query)
                
                print(f"Inserting {len(skills)} skills...")
                for i, skill in enumerate(skills):
                    print(f"  Skill {i+1}: {skill}")
                    offerSkill_query = self.offer_skills.insert().values(
                        offer_id=id,
                        skill_id=skill
                    )
                    conn.execute(offerSkill_query)

                conn.commit()
                print(f"Offer created successfully with ID: {id}")
                return {"status": "ok", "offer_id": str(id)}
        except Exception as e:
            print(f"Database error in create_offer: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"status": "ng", "error": str(e)}
    
    def update_offer(self, offer_id, title, content, rank, skills, salary=None, capacity=None):
        try:
            with self.engine.connect() as conn:
                update_values = {}
                update_values["deadline"] = datetime.now(JST)
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
    
    def get_all_skills(self):
        """
        全スキル一覧を取得
        """
        try:
            with self.engine.connect() as conn:
                stmt = select(
                    self.skills.c.id.label("skill_id"),
                    self.skills.c.name.label("skill_name")
                ).order_by(self.skills.c.name)
                
                result = conn.execute(stmt).mappings().all()
                return {"status": "ok", "skills": list(result)}
                
        except Exception as e:
            return {"status": "ng", "error": str(e)}
    
    def read_all_offers_paginated(self, page: int = 1, limit: int = 6, rank_filter: str = None, user_id: str = None, favorites_only: bool = False):
        """
        オファーをページング対応で取得
        """
        with self.engine.connect() as conn:
            j1 = outerjoin(self.offers, self.enterprises, self.offers.c.enterprise_id == self.enterprises.c.id)
            j2 = outerjoin(j1, self.offer_skills, self.offers.c.id == self.offer_skills.c.offer_id)
            j3 = outerjoin(j2, self.skills, self.offer_skills.c.skill_id == self.skills.c.id)
            j4 = outerjoin(j3, self.ranks, self.offers.c.rank == self.ranks.c.id)
            
            # 気になるオファーフィルター用のjoin
            if favorites_only and user_id:
                j5 = outerjoin(j4, self.user_offers, 
                    (self.offers.c.id == self.user_offers.c.offer_id) & 
                    (self.user_offers.c.user_id == user_id) & 
                    (self.user_offers.c.favorite == True))
            else:
                j5 = j4

            # ベースクエリ
            base_stmt = select(
                self.offers.c.id.label("offer_id"),
                self.enterprises.c.name.label("enterprise_name"),
                self.offers.c.title.label("offer_title"),
                self.offers.c.content.label("offer_content"),
                self.offers.c.deadline.label("deadline"),
                self.offers.c.salary.label("salary"),
                self.offers.c.capacity.label("capacity"),
                self.ranks.c.name.label("rank"),
                self.skills.c.name.label("skill_name")
            ).select_from(j5)

            # フィルター条件の構築
            where_conditions = []
            
            # ランクフィルターの適用
            if rank_filter:
                where_conditions.append(self.ranks.c.name == rank_filter)
            
            # 気になるオファーフィルターの適用
            if favorites_only and user_id:
                where_conditions.append(self.user_offers.c.favorite == True)
                where_conditions.append(self.user_offers.c.user_id == user_id)
            
            # WHERE条件を適用
            if where_conditions:
                base_stmt = base_stmt.where(*where_conditions)

            # 総件数を取得（distinct offer_idで重複除去）
            count_stmt = select(func.count(func.distinct(self.offers.c.id))).select_from(j5)
            if where_conditions:
                count_stmt = count_stmt.where(*where_conditions)
            
            total_count = conn.execute(count_stmt).scalar()

            # ページング計算
            offset = (page - 1) * limit
            total_pages = (total_count + limit - 1) // limit  # 切り上げ計算

            # データ取得（LIMIT/OFFSET適用前にdistinct offer_idで重複除去）
            # まず、対象のoffer_idを取得
            offer_ids_stmt = select(
                func.distinct(self.offers.c.id).label("offer_id"),
                self.offers.c.created_at
            ).select_from(j5)
            if where_conditions:
                offer_ids_stmt = offer_ids_stmt.where(*where_conditions)
            offer_ids_stmt = offer_ids_stmt.order_by(self.offers.c.created_at.desc()).limit(limit).offset(offset)
            
            offer_ids_result = conn.execute(offer_ids_stmt).fetchall()
            if not offer_ids_result:
                return {
                    "offers": [],
                    "total_count": total_count,
                    "total_pages": total_pages,
                    "current_page": page,
                    "has_next": False,
                    "has_prev": page > 1
                }

            offer_ids = [row.offer_id for row in offer_ids_result]

            # 対象のoffer_idに対するすべての関連データを取得
            final_stmt = base_stmt.where(self.offers.c.id.in_(offer_ids)).order_by(self.offers.c.created_at.desc())
            result = conn.execute(final_stmt).mappings().all()

            if not result:
                return {
                    "offers": [],
                    "total_count": total_count,
                    "total_pages": total_pages,
                    "current_page": page,
                    "has_next": False,
                    "has_prev": page > 1
                }

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

            return {
                "offers": list(offer_dict.values()),
                "total_count": total_count,
                "total_pages": total_pages,
                "current_page": page,
                "has_next": page < total_pages,
                "has_prev": page > 1
            }
    
    def get_skill_matched_offers(self, user_id: str):
        """
        ユーザーのスキルにマッチするオファーを取得
        """
        try:
            with self.engine.connect() as conn:
                # Step 1: ユーザーのスキルIDを取得
                user_skills_stmt = select(
                    self.user_skills.c.skill_id
                ).where(self.user_skills.c.user_id == user_id)
                
                user_skills_result = conn.execute(user_skills_stmt).mappings().all()
                
                if not user_skills_result:
                    # ユーザーにスキルが設定されていない場合は空の結果を返す
                    return {"status": "ok", "offers": []}
                
                user_skill_ids = [row["skill_id"] for row in user_skills_result]
                
                # Step 2: マッチするオファーIDを取得
                matching_offers_stmt = select(
                    self.offer_skills.c.offer_id
                ).where(self.offer_skills.c.skill_id.in_(user_skill_ids)).distinct()
                
                matching_offers_result = conn.execute(matching_offers_stmt).mappings().all()
                
                if not matching_offers_result:
                    # マッチするオファーがない場合
                    return {"status": "ok", "offers": []}
                
                matching_offer_ids = [row["offer_id"] for row in matching_offers_result]
                
                # Step 3: マッチしたオファーの詳細情報を取得
                j1 = outerjoin(self.offers, self.enterprises, self.offers.c.enterprise_id == self.enterprises.c.id)
                j2 = outerjoin(j1, self.ranks, self.offers.c.rank == self.ranks.c.id)
                
                offers_stmt = select(
                    self.offers.c.id.label("offer_id"),
                    self.enterprises.c.name.label("enterprise_name"),
                    self.offers.c.title.label("offer_title"),
                    self.offers.c.content.label("offer_content"),
                    self.offers.c.deadline.label("deadline"),
                    self.offers.c.salary.label("salary"),
                    self.offers.c.capacity.label("capacity"),
                    self.ranks.c.name.label("rank")
                ).select_from(j2).where(self.offers.c.id.in_(matching_offer_ids))
                
                offers_result = conn.execute(offers_stmt).mappings().all()
                
                # Step 4: 各オファーのスキル情報を取得
                skills_stmt = select(
                    self.offer_skills.c.offer_id,
                    self.skills.c.name.label("skill_name")
                ).select_from(
                    self.offer_skills.join(
                        self.skills, self.offer_skills.c.skill_id == self.skills.c.id
                    )
                ).where(self.offer_skills.c.offer_id.in_(matching_offer_ids))
                
                skills_result = conn.execute(skills_stmt).mappings().all()
                
                # スキル情報をオファーIDごとにグループ化
                skills_by_offer = {}
                for skill_row in skills_result:
                    offer_id = skill_row["offer_id"]
                    if offer_id not in skills_by_offer:
                        skills_by_offer[offer_id] = []
                    skills_by_offer[offer_id].append(skill_row["skill_name"])
                
                # Step 5: 結果を整理
                offers_list = []
                for row in offers_result:
                    offer_id = row["offer_id"]
                    offer_data = {
                        "offer_id": offer_id,
                        "enterprise_name": row["enterprise_name"],
                        "offer_title": row["offer_title"],
                        "offer_content": row["offer_content"],
                        "deadline": row["deadline"],
                        "salary": row["salary"],
                        "capacity": row["capacity"],
                        "rank": row["rank"],
                        "skills": skills_by_offer.get(offer_id, [])
                    }
                    offers_list.append(offer_data)
                
                return {"status": "ok", "offers": offers_list}
                
        except Exception as e:
            return {"status": "ng", "error": str(e)}
