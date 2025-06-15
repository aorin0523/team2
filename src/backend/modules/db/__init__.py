from sqlalchemy import create_engine, MetaData, Table
import os

class BaseDB: 
    """
    BDの初期化を行うクラス
    """

    def __init__(self):
        self.engine = create_engine(
            f"mysql+pymysql://{os.getenv("MYSQL_USER")}:{os.getenv("MYSQL_PASSWORD")}@{os.getenv("DB_CONTAINER_ADDRESS")}/{os.getenv("MYSQL_DATABASE")}",
        )

        self.metadata = MetaData()
        self.metadata.reflect(bind=self.engine)

        self.skills = self.metadata.tables["Skills"]
        self.ranks = self.metadata.tables["Ranks"]
        self.users = self.metadata.tables["Users"]
        self.enterprises = self.metadata.tables["Enterprises"]
        self.offers = self.metadata.tables["Offers"]
        self.user_skills = self.metadata.tables["UserSkills"]
        self.user_offers = self.metadata.tables["UserOffers"]
        self.offer_skills = self.metadata.tables["OfferSkills"]
