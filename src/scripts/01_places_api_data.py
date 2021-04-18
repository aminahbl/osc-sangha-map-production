import os
import time
import json
import googlemaps
from aux.functions import (get_key, get_remaining_restults, get_place_details, print_output)
from aux.locations_01 import SEARCH_LOCATIONS
import aux.record as record


dirname = os.path.dirname(__file__)
rootdir = dirname[0:-12]
key_path = f"{rootdir}.env"
json_datafile_path = f"{rootdir}src/data/46_data.json"
process_record_path = f"{rootdir}src/scripts/aux/record.py"


with open(json_datafile_path, "r", encoding="utf-8") as file:
    places_api_data = json.load(file)


cordinates = SEARCH_LOCATIONS
cordinates_start_index = record.search_start_index
unique_locations = record.retreived_locations
processing_chunk = 40
places_data = places_api_data
next_page_token = ""

API_KEY = get_key(key_path)
gmaps = googlemaps.Client(key=API_KEY)

for i, location in enumerate(cordinates[cordinates_start_index:cordinates_start_index + processing_chunk]):

    lat = location[0]
    lng = location[1]

    places_results = gmaps.places(query="buddhist monastery", location=f"{lat},{lng}", radius=50000)
    if "next_page_token" in places_results:
        next_page_token = places_results["next_page_token"]

    for place in places_results["results"]:
        place_details = get_place_details(place, unique_locations, gmaps)

        if place_details != None:
            unique_locations.append(place_details["properties"]["name"])
            places_data["places"].append(place_details)
    
    time.sleep(3)

    remaining_results = get_remaining_restults(gmaps, next_page_token)

    if len(remaining_results) > 0: 
        for place in remaining_results:
            place_details = get_place_details(place, unique_locations, gmaps)

            if place_details != None:
                unique_locations.append(place_details["properties"]["name"])
                places_data["places"].append(place_details)

    print_output(process_record_path, cordinates_start_index + i + 1, unique_locations, json_datafile_path, places_data)
