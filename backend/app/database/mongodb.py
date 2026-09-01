from pymongo import MongoClient

from app.core.config import settings

client = MongoClient(settings.MONGO_URI)
db = client[settings.DB_NAME]


def get_collection(name: str):
    return db[name]
