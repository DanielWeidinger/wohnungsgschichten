import matplotlib.pyplot as plt
import pandas as pd
from utils.geo import POIs_to_indicies
from dotenv import load_dotenv

load_dotenv()


def add_metrics(df: pd.DataFrame, POIs: list = []):
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
    if len(POIs) > 0:
        indices = POIs_to_indicies(POIs)
        df.loc[:, 'distance'] = df[indices].mean()

    # overall score
    df['score'] = 0
    df['score'] += get_deviation_std_norm_dist(df['mean_ppms'])
    df['score'] += get_deviation_std_norm_dist(df['distance'])


def plot_norm_dists(df: pd.DataFrame):
    df['mean_ppms'].plot(kind='hist')
    plt.savefig('analysis/figures/mean_ppms_hist.png')
    plt.show()


def get_deviation_std_norm_dist(column: pd.Series, less_is_better=True):
    mu = column.mean()
    sigma = column.std()

    return ((column-mu)/sigma)*(-1 if less_is_better else 1)
