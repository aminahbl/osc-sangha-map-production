# Volunteer Data Refining Notes

Here be skeleton notes to guide volunteers who'd like to refine data in the first stage of the project.

## Overview

A [dedicated `data` branch](https://github.com/aminahbl/osc-sangha-map-production/tree/data) has been created for updates to place data. All pull requests should be made to this branch.

Place data files live here in [`src` > `data`](https://github.com/aminahbl/osc-sangha-map-production/tree/data/src/data)

- `initial-data-fetch` is now unused and only serves a referrence purpose.
- `production` contains the data files currently populating the live map.
- `stored` contains data files for places that were retrieved in the initial data fetch, but did not pass the initial crude, automated filtering and await manual review. 

## Working with the data

In the first round of refinement, the `production` files will be review. 

### Getting started
(Note: the following has been drafted for those completely new to GitHub)

1. [Create a GitHub account](https://github.com/).
2. Navigate to the [`production`](https://github.com/aminahbl/osc-sangha-map-production/tree/data/src/data/production) directory in the `data` branch.
3. Select the next file for review (by coordination).

### Editing a file
The following gives two practical methods of edit data files. The data schema to be following is covered in the section below.

#### Method 1:
1. Click on the the edit icon on the top right of the file. 
2. Update the data using valid JSON syntax (all submissions will be validated so errors are not a major concern)
3. Write a very breief description (or "commit") message summerizing the changes made in the "Propose changes" section & hit the "Propose changes" button.
4. Open a pull request (after which the edits will be reviewed and merged into the live map) 

#### Method 2:
For more user friendly JSON editor interface:

1. Click on "Raw" near the top right of the JSON file. 
2. Copy the URL
3. Navigate to https://jsonformatter.org/json-editor/
4. Click on "Load Data" and paste in the URL
5. In the righthand pane toggle the `Tree` view to `Code` view to get the expanded window option & then toggle again to `Tree` view for user-friendly editor.
6. Update the data.
7. When finished, exit full screen mode, send the updated data from the right window to the left window
8. Select the JSON Validator.
9. Click copy to clipboard.
10. Navigate back to GitHub
11. Follow the setps in method 1 (selecting all of the existing file and pasting updated version.)


### Working Data Schema

Field types:
```
""  - String (text)
0   - A number (not in a string) 
[]  - Array (a list of things, seperated by commas)
{}  - Object (a named list of things)
```


```
{   
  "properties": {
    "geometry": {
        "location": {
          longitude,
          latitude
        }
      },
      "formatted_address": "",
      "international_phone_number": "",
      "name": "",
      "place_id": "",      // Google's
      "url": "",           // to location on Google Maps
      "website": "",
      "description": "",
      "tradition": ""
      "monastics": [""],
      "video": [""],
      "audio": [""],
      "images": [""]

  },
  "meta": {
      "verified": "false",
      "last_updated": ""
      "notes": ""
  }
}
```

#### Place Inclusion Criteria

- The community follows [Vinaya](https://suttacentral.net/pitaka/vinaya) based ordination (see [intro to the Vinaya](https://suttacentral.net/vinaya)).
- By case by case assesment for edge cases.
  - Aligned with the mission to promote a dana culture
  - TBC

##### Verified property values:

- `"true"`
- `"tentative"`
- `"verified, accepts lay residents"`
- `"duplicate"`
- `"false"`
- `"remove"`

In the case of duplicates: 
- if they have the same id key: remove
- if not: mark the least poulated entry as `duplicate` and copy over any information not in the other entry. 


