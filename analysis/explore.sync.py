import os
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
import hvplot.pandas
from shapely.geometry import Point
from sklearn.cluster import KMeans
from ogd_at_lab.dataaccess import get_gdf_from_wfs

# %%
if not os.path.exists('./data/WLANWIENATOGD.csv'):
    print("Downloading data")
    download_url = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WLANWIENATOGD&srsName=EPSG:4326&outputFormat=csv"
    os.system(
        f"wget '{download_url}' -O ./data/WLANWIENATOGD.csv")

gdf = get_gdf_from_wfs('WLANWIENATOGD')

# %%
points = gdf['geometry'].apply(lambda x: (x.x, x.y)).tolist()

k = 25  # Number of clusters
kmeans = KMeans(n_clusters=k, )
kmeans.fit(points)

labels = kmeans.labels_
assert labels is not None
unique_labels, count = np.unique(labels, return_counts=True)
print(unique_labels, count)

gdf.hvplot(geo=True, tiles='OSM', alpha=0.5, color='blue', size=5)

# %%
centers = kmeans.cluster_centers_
assert centers is not None
centers_df = pd.DataFrame(zip(unique_labels, [True]*len(unique_labels), count),
                          columns=['name', 'is_center', 'count'])
geometry = [Point(xy) for xy in centers]
centers_gdf = gpd.GeoDataFrame(centers_df, geometry=geometry)
gdf['is_center'] = False

merged_gdf = gpd.GeoDataFrame(
    pd.concat([centers_gdf, gdf], ignore_index=True), crs=gdf.crs)
colors = np.where(merged_gdf['is_center'], 'red', 'blue')
merged_gdf.hvplot(geo=True, title="OSM", alpha=0.5,
                  color=colors, size=5)

# %%
top_clusters = 10
biggest_clusters = np.argsort(count)[::-1][:top_clusters]

print(biggest_clusters, count[biggest_clusters])

merged_gdf = gpd.GeoDataFrame(
    pd.concat([centers_gdf.iloc[biggest_clusters], gdf], ignore_index=True), crs=gdf.crs)
colors = np.where(merged_gdf['is_center'], 'red', 'blue')
merged_gdf.hvplot(geo=True, title="OSM", alpha=0.5,
                  color=colors, size=5)

# %%
print(centers_gdf.columns)
# arr = np.array(centers_gdf.iloc[biggest_clusters]
#                [["geometry", "count"]].apply(lambda x: (x["count"], x["geometry"].x, x["geometry"].y)))
arr = np.zeros((top_clusters, 3))
arr[:, 0] = count[biggest_clusters]
arr[:, 1:] = centers[biggest_clusters]
np.save("./data/cluster_centers.npy", arr)
