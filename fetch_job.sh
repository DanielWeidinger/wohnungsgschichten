#!/bin/bash

# Fetch Flats
curl 'http://localhost:4000/graphql' \
	-X POST \
	-H 'content-type: application/json' \
	--data '{
    "query":"mutation { fetchLatestFlats }"
  }'

# Augment Data
python3 /app/analytics/annotate.py
