# Gathering

Check data folder
Basiert auf nodeJS

Search basiert auf Searchqueries: Siehe SearchQueries.ts

## Wie kriegt man das zum laufen oida?

step 4 step
```
npm install
npm run tsc
npm run start
```

Man muss den Scraper anhauen.
Graphql Localhost 4000 und mutation fetchLatestFlasts.

## Config

.env file im data folder

```
MONGO_CONNECTION_STRING=xyz # MongoDB Connection String -> https://www.mongodb.com/docs/manual/reference/connection-string/
```


# Analysis

Check analysis ordner
Basiert auf Python

Erstellt ein CSV und enriched die Datenbank mit ausgewerteten Daten.

Manuell machen. (run.py)

## Config

.env file im analysis folder

```
MONGO_CONNECTION_STRING=xyz # MongoDB Connection String -> https://www.mongodb.com/docs/manual/reference/connection-string/
GMAPS_KEY=xyz # Key für Google Maps Distanzmessung
```
