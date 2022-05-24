from pymongo import DESCENDING
from pymongo.mongo_client import MongoClient
from pymongo.operations import UpdateOne


class MongoRepository:
    def __init__(self, connectionString: str) -> None:
        self.client = MongoClient(connectionString)
        self.db = self.client.flats
        self.flats = self.db.flats
        self.updates = self.db.updates

    def get_latest_flats(self):
        latest_update = self.updates.find().sort(
            "timestamp", DESCENDING).limit(1)[0]['timestamp']

        flats = list(self.flats.find({'lastCheck': latest_update}))
        return flats

    def update_all(self, values, indicies):
        bulk_updates = [UpdateOne({"_id": row["_id"]}, {
            '$set': {i: row[i] for i in indicies}}) for row in values]
        results = self.flats.bulk_write(bulk_updates)
        return results.modified_count
