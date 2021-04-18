import time
import json
import regex

def slugify(string):
    string = string.strip()

    # remove accents, swap ñ for n, etc
    non_sluggy_chars = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
    sluggy_chars = "aaaaeeeeiiiioooouuuunc------"

    for i, char in enumerate(non_sluggy_chars):
        string = regex.sub(char, sluggy_chars[i], string)

    # remove invalid chars
    string = regex.sub("[^a-z0-9 -]", "", string)
    # replace whitespace with -
    string = regex.sub("\s+", "-", string)
    # collapse dashes
    string = regex.sub("-+", "-", string)

    return string


def get_key(key_path):
    API_KEY = ""
    with open(key_path, "r") as f:
        key_file = f.read()
    lines = key_file.splitlines()
    for line in lines:
        if line.find("GOOGLE_MAPS_API_KEY") != -1:
            API_KEY = line[20:]
    return API_KEY


# Places API searches return a maximum number of 60 results
def get_remaining_restults(gmaps, next_page_token):
    if next_page_token == "":
        return
    results = []
    next_places_results = gmaps.places(page_token=next_page_token)
    results.extend(next_places_results["results"])

    if "next_page_token" in next_places_results:
        time.sleep(3)
        last_places_results = gmaps.places(page_token=next_places_results["next_page_token"])
        results.extend(last_places_results["results"])

    return results


def get_place_details(place, unique_locations, gmaps):
    escape_words = ["cathedral", "mosque", "abbey"]
    tentative_words = ["vihara", "monastery", "wat", "temple", "hermitage"]
    
    for word in escape_words:
        if word in place["name"].lower():
            return 

    if place["name"] in unique_locations:
        return         

    location_id = place["place_id"]
    retrieval_fields = ["name", "place_id", "geometry", "formatted_address", "international_phone_number", "website", "url", "photo"]

    place_details = {"result": {"properties" : {}, "meta": {}}}

    api_result = gmaps.place(place_id=location_id, fields=retrieval_fields)

    place_details["result"]["properties"].update(api_result["result"])

    place_details["result"]["properties"]

    place_details["result"]["properties"]["description"] = ""
    place_details["result"]["properties"]["tradition"] = ""
    place_details["result"]["properties"]["monastics"] = []
    place_details["result"]["properties"]["video"] = []
    place_details["result"]["properties"]["audio"] = []
    
    place_details["result"]["meta"]["verified"] = False
    place_details["result"]["meta"]["last_updated"] = "2021-04-17"
    
    for word in tentative_words:
        if word in place["name"].lower():
            place_details["result"]["meta"]["verified"] = "tentative"
            break

    return place_details["result"]


def print_output(record_path, count, locations, json_path, places_data):
    with open(record_path, "w") as file:
        file.write(
            f"""# Locations correspond to SEARCH_LOCATIONS list in variables.py

# no_of_locations_searched:
search_start_index = {count}

retreived_locations = {locations}
            """
        )

    with open(json_path, "w") as file:
        json.dump(places_data, file, indent=2, ensure_ascii=False)


def get_images(place_details, gmaps, image_dir):

    photo_id = place_details["photos"][0]["photo_reference"]

    photo_width = 700
    photo_height = 700

    raw_image_data = gmaps.places.photo(photo_reference=photo_id, max_width=photo_width, max_height=photo_height)

    with open(f"{image_dir}/{place_details['place_id'].lower()}.jpg", "wb") as file:
        for chunk in raw_image_data:
            if chunk:
                file.write(chunk)