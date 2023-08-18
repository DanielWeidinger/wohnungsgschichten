import os
import pandas as pd
from dotenv import load_dotenv
from MongoRepository import MongoRepository
from utils import add_metrics

load_dotenv()

repo = MongoRepository(str(os.getenv("MONGO_CONNECTION_STRING")))
flats = repo.get_latest_flats()
df = pd.DataFrame(flats)
print(f"Got {len(flats)} entries")

add_metrics(df)

print(df.sort_values('score', ascending=False))
filter_words = ['Gemeinde', 'Sozial']
urls = df.sort_values('score', ascending=False)[~df['heading'].apply(
    lambda x: any(word.lower() in x.lower() for word in filter_words))][['heading', 'seo_url', "distance", "distance_tu_text", "distance_wu_text", "mean_ppms"]]  # [:10]
with open("kek.csv", "w") as f:
    lines = [
        f"{x[0]};https://www.willhaben.at/{x[1]};{x[3]};{x[4]};{x[2]};{x[5]}" for x in urls.values]
    lines.insert(
        0, "Heading;URL;distance_tu;distance_wu;distane_avg[min];Price per m^2")
    f.write("\n".join(lines))
    print(f"wrote {len(lines)} lines")


print()
