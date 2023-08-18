import os
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import hvplot.pandas
from sklearn.cluster import KMeans
from ogd_at_lab.dataaccess import get_gdf_from_wfs


# %%
if not os.path.exists('./data/WLANWIENATOGD.csv'):
    print("Downloading data")
    download_url = "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WLANWIENATOGD&srsName=EPSG:4326&outputFormat=csv"
    os.system(
        f"wget '{download_url}' -O ./data/WLANWIENATOGD.csv")

df = pd.read_csv('./data/WLANWIENATOGD.csv', sep=',')
df.head()

# %%
points = df['SHAPE'].apply(lambda x: x.split(' ')[1:3]).apply(
    lambda x: [float(x[0][1:]), float(x[1][:-1])]).tolist()

k = 25  # Number of clusters
kmeans = KMeans(n_clusters=k, )
kmeans.fit(points)

labels = kmeans.labels_
unique_labels, count = np.unique(labels, return_counts=True)
print(unique_labels, count)

plt.scatter(*zip(*points), c=labels, s=1, cmap='viridis')

# %%
centers = kmeans.cluster_centers_
plt.scatter(*zip(*centers),
            c=unique_labels, s=10, cmap='viridis')

# %%
top_clusters = 5
biggest_clusters = np.argsort(count)[::-1][:top_clusters]

print(biggest_clusters, count[biggest_clusters])

# %%
gdf = get_gdf_from_wfs('WLANWIENATOGD')
gdf.hvplot(geo=True, tiles='OSM', alpha=0.5, color='blue', size=1)
