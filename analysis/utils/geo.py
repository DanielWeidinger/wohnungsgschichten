import os
import pandas as pd
import googlemaps
from tqdm import tqdm
from datetime import datetime

from utils.POI import POIs_to_indicies

long_departure = int(os.environ.get("GMAPS_DEPARTURE", 0))
departure = datetime.fromtimestamp(long_departure)
gmaps = googlemaps.Client(key=os.getenv('GMAPS_KEY'))


def annotate_data_dist(df, POIs):
    # Add distance columns if not present
    indices = POIs_to_indicies(POIs)
    if indices not in df.columns:
        print('Add distance column for processing')
        df[indices] = None

    affected_entries = df[indices].isnull()
    if affected_entries.any():
        df_no_distance = df[affected_entries]

        print(f"{len(df_no_distance)} entries with no distance found")
        df_with_distance = add_dists(df_no_distance, POIs)
        df.loc[affected_entries, indices] = df_with_distance[indices]

    return df


def get_dist(origin, destination, entry, key_name, mode="transit"):
    try:
        dist = gmaps.directions(origin,
                                destination,
                                mode=mode,
                                departure_time=departure,
                                region="at",
                                alternatives=False)
        if dist and len(dist) > 0:
            dist = dist[0]['legs'][0]['duration']
            entry[key_name] = dist['value']
            # entry[f"{key_name}_text"] = dist['text']
        else:
            print(f"No Directions found for {origin} to {destination}: {dist}")
    except Exception as e:
        print("GMaps API error is aufgetretten brudi!")
        print(e)


def get_dists_for_row(entry, POIs: list):
    origin = f"{entry['address'] if 'address' in entry and isinstance(entry['address'], str) else ''} {entry['location']}".strip(
    )
    result = {}
    for poi in POIs:
        get_dist(origin, poi.address, result, f"distance_{poi.get_name()}")

    return result


def add_dists(data: pd.DataFrame, POIs):
    print(f"{len(data)} flats")
    print(f"using {str(departure)} as departure")
    data = data.copy()
    distances = []
    for _, entry in tqdm(data.iterrows(), total=len(data)):
        distances.append(get_dists_for_row(entry, POIs))

    df_dist = pd.DataFrame(distances)
    indicies = POIs_to_indicies(POIs)
    data.loc[:, indicies] = df_dist[indicies].to_numpy()
    return data
