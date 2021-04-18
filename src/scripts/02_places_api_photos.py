import os
import time
import googlemaps
from aux.functions import (get_key, get_remaining_restults, get_place_details, print_output)
from aux.variables import SEARCH_LOCATIONS
import aux.record as record


dirname = os.path.dirname(__file__)
rootdir = dirname[0:-12]
key_path = f"{rootdir}.env"
image_dir = f"{rootdir}src/images/places"
json_output_path = f"{rootdir}src/data/json/08-places-data-testing.json"
process_record_path = f"{rootdir}src/scripts/aux/record.py"


API_KEY = get_key(key_path)
gmaps = googlemaps.Client(key=API_KEY)

cordinates = SEARCH_LOCATIONS
cordinates_start_index = record.search_start_index
unique_locations = record.retreived_locations
processing_chunk = 5
places_data = {"results": []}
next_page_token = ""


for i, location in enumerate(cordinates[cordinates_start_index:cordinates_start_index + processing_chunk]):

    lat = location[0]
    lng = location[1]

    places_results = gmaps.places(query="buddhist monastery", location=f"{lat},{lng}", radius=50000)
    if "next_page_token" in places_results:
        next_page_token = places_results["next_page_token"]

    for place in places_results["results"]:
        place_details = get_place_details(place, unique_locations, gmaps, image_dir)

        if place_details != None:
            unique_locations.append(place_details["name"])
            places_data["results"].append(place_details)
    
    time.sleep(3)

    remaining_results = get_remaining_restults(gmaps, next_page_token)

    for place in remaining_results:
        place_details = get_place_details(place, unique_locations, gmaps, image_dir)

        if place_details != None:
            unique_locations.append(place_details["name"])
            places_data["results"].append(place_details)

    print_output(process_record_path, cordinates_start_index + i + 1, unique_locations, json_output_path, places_data)
