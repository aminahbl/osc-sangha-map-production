import {Client} from "@googlemaps/google-maps-services-js"

const fs = require("fs")

/*
 * FUNCTIONS
 *
 */

function jsonReader(filePath, callBack) {
  fs.readFile(filePath, "utf-8", (err, dataString) => {
    if (err) {
      return callBack && callBack(err)
    }

    try {
      const data = JSON.parse(dataString)
      return callBack && callBack(null, data)
    } catch (err) {
      return callBack && callBack(err)
    }
  })
}

function getPhotoURLs(photos) {
    // TODO
    imageUrls = photos.map(photo => {
        const url = photo.getUrl({
            maxWidth: 600,
            maxHeight: 400
        })
        return url
    })
    return imageUrls
}

/*
 * CALLS
 *
 */

const maps = new Client({})

const dataDir = "./src/data-test/"
const dataFiles = fs.readdirSync(dataDir)

maps
  .places({
    params: {
      locations: [{ lat: 45, lng: -110 }],
      key: process.env.GOOGLE_MAPS_API_KEY
    },
    timeout: 1000, // milliseconds
  })
  .then((r) => {
    console.log(r.data.results[0].elevation);
  })
  .catch((e) => {
    console.log(e.response.data.error_message);
  });

dataFiles.forEach(file => {
  jsonReader(`${dataDir}${file}`, (err, data) => {
    if (err) {
      console.log("Error reading:", err)
    } else {
      const regex = /(true|tentative|verified, accepts lay residents)/i
      const timestamp = new Date()

      data.places.forEach((place, i) => {
        if (
          place.meta.verified.match(regex) &&
          place.properties.photos.length
        ) {
          /* 
           1. photoURLs = getPhotoURLs(place.photos)
           2. data.places[i].properties.image_urls = [...photoURLs]
           */
          data.places[i].meta.last_updated = timestamp.toISOString()
        }
      })

      fs.writeFile(`${dataDir}${file}`, JSON.stringify(data, null, 2), err => {
        if (err) {
          console.log("Error writing:", err)
        }
      })
    }
  })
})
