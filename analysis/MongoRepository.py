from pymongo import DESCENDING
from pymongo.mongo_client import MongoClient


class MongoRepository:
    def __init__(self, connectionString: str) -> None:
        self.client = MongoClient(connectionString)
        self.db = self.client.flats
        self.flats = self.db.flats
        self.updates = self.db.updates

    def get_latest_flats(self):
        latest_update = self.updates.find().sort(
            "datetime", DESCENDING).limit(1)[0]['timestamp']

        flats = self.flats.find({'lastCheck': latest_update})
        return list(flats)
