import os
import pandas as pd
from dotenv import load_dotenv
from MongoRepository import MongoRepository
from utils.geo import POIs_to_indicies, annotate_data_dist

load_dotenv()

repo = MongoRepository(str(os.getenv("MONGO_CONNECTION_STRING")))
flats = repo.get_latest_flats()
df = pd.DataFrame(flats)
print(f"Got {len(flats)} entries")

POIs = []

indices = POIs_to_indicies(POIs)
annotate_data_dist(df, POIs)
count = repo.update_all(df.to_dict('records'), indices)
print(f"Updated {count} entries in the DB")
