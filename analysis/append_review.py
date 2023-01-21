import os
import pandas as pd
import numpy as np
from MongoRepository import MongoRepository


repo = MongoRepository(str(os.getenv("MONGO_CONNECTION_STRING")))
flats = repo.get_latest_flats()
df = pd.DataFrame(flats)
print(f"Got {len(flats)} entries")

reviewed_len = 29
df['reviewed'] = [x < reviewed_len for x in range(len(df))]

count = repo.update_all(df.to_dict('records'), ['reviewed'])
print(f"Updated {count} entries in the DB")
