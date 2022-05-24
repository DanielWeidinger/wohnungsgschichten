import os
import pandas as pd
import numpy as np
from scipy.stats import norm
import json

from utils import add_metrics, get_deviation_std_norm_dist
from MongoRepository import MongoRepository

repo = MongoRepository(
    f"mongodb+srv://weidinger:{os.environ['WOHNUNGSGSCHICHTEN_ATLAS_PW']}@cluster0.sh9uc.mongodb.net/?retryWrites=true&w=majority")
flats = repo.get_latest_flats()
df = pd.DataFrame(flats)


#     df_raw = pd.read_json(f)
#     df = df_raw[['price', 'rooms', 'seo_url',
#                  'estate_size', 'free_area/free_area_area_total', 'free_area_type_name', 'address', 'postcode', 'location', 'distance_tu', 'distance_wu']]

add_metrics(df)
# plot_norm_dists(df)

# Calculate attribute scores
df['score'] = 0
df['score'] += get_deviation_std_norm_dist(df['mean_ppms'])
df['score'] += get_deviation_std_norm_dist(df['distance'])
df[df['rooms'] == 3]['score'] += 2

print(df.sort_values('score', ascending=False))
urls = df.sort_values('score', ascending=False)['seo_url'][:10]
print("\n".join([f"https://www.willhaben.at/{x}" for x in urls.values]))


print()
