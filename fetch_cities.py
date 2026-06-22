import urllib.request
import json
import os

print("Downloading comprehensive cities database...")
url = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/cities.json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())

print("Filtering for Indian cities and municipalities...")
indian_cities = [f"{city['name']}, {city['state_name']}" for city in data if city['country_code'] == 'IN']

# Add states as well
states_url = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json"
req_states = urllib.request.Request(states_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req_states) as response:
    states_data = json.loads(response.read().decode())

indian_states = [state['name'] for state in states_data if state['country_code'] == 'IN']

# Combine and deduplicate
all_locations = list(set(indian_states + indian_cities))

# Sort alphabetically
all_locations.sort()

# Write to file
output_path = os.path.join("src", "data", "locations.js")
print(f"Writing {len(all_locations)} locations to {output_path}...")

with open(output_path, "w", encoding="utf-8") as f:
    f.write("export const INDIAN_LOCATIONS = [\n")
    for loc in all_locations:
        # Escape quotes
        safe_loc = loc.replace('"', '\\"')
        f.write(f'  "{safe_loc}",\n')
    f.write("];\n")

print("Done!")
