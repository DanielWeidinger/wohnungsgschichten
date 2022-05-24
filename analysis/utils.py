from datetime import datetime
import os
from shutil import Error
import googlemaps
import matplotlib.pyplot as plt
import pandas as pd
from tqdm import tqdm

departure = datetime.fromtimestamp(1652684400)
gmaps = googlemaps.Client(key=os.environ['WOHNUNGSGSCHICHTEN_GMAPS_KEY'])

indicies = ['distance_tu', 'distance_wu',
            'distance_tu_text', 'distance_wu_text']


def add_metrics(df):
    # price per meter sqaured
    df.loc[:, 'ppms'] = df['price'] / \
        df['estate_size']
    df['ppms_free'] = df['price'] / \
        (df['free_area/free_area_area_total'] + df['estate_size'])
    df['mean_ppms'] = (
        df['ppms'] + df['ppms_free']) / 2
    df.loc[df['mean_ppms'].isnull(
    ), 'mean_ppms'] = df[df['mean_ppms'].isnull()]['ppms']

    # distance
    df.loc[:, 'distance'] = (df['distance_tu'] + df['distance_wu']) / 2


def plot_norm_dists(df: pd.DataFrame):
    df['mean_ppms'].plot(kind='hist')
    plt.savefig('analysis/figures/mean_ppms_hist.png')
    plt.show()


def get_deviation_std_norm_dist(column: pd.Series, less_is_better=True):
    mu = column.mean()
    sigma = column.std()

    return ((column-mu)/sigma)*(-1 if less_is_better else 1)


tu_destination = "Technische Universität Wien, 1040 Wien"
wu_destination = "Wirtschaftsuniversität Wien, Welthandelsplatz, Wien"


def get_dist(origin, destination, entry, key_name):
    try:
        dist = gmaps.directions(origin,
                                destination,
                                mode="transit",
                                departure_time=departure,
                                region="at",
                                alternatives=False)[0]['legs'][0]['duration']
        if dist and len(dist) > 0:
            entry[key_name] = dist['value']
            entry[f"{key_name}_text"] = dist['text']
        else:
            print(f"No Directions found for {origin} to {destination}: {dist}")
    except:
        print("GMaps API error is aufgetretten brudi!")


def get_dists_for_row(entry):
    origin = f"{entry['address'] if 'address' in entry else ''} {entry['location']}"
    result = {}
    get_dist(origin, tu_destination, result, 'distance_tu')
    get_dist(origin, wu_destination, result, 'distance_wu')
    return result


def add_dists(data: pd.DataFrame):
    print(f"{len(data)} flats")
    print(f"using {str(departure)} as departure")
    data = data.copy()
    distances = []
    for _, entry in tqdm(data.iterrows(), total=len(data)):
        distances.append(get_dists_for_row(entry))

    df_dist = pd.DataFrame(distances)
    data.loc[:, indicies] = df_dist[indicies].to_numpy()
    return data
