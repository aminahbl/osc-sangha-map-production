const fs = require("fs")
const { Client } = require("@googlemaps/google-maps-services-js")

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

function addImageData(file, data, i, photos) {
  const mapsClient = new Client({})
  const timestamp = new Date()

  data.places[i].properties.image_urls = []

  photos.map(async photo => {
    let params = {
      key: "",
      photoreference: photo.photo_reference,
      maxwidth: 800,
      maxheight: 800,
    }

    let url = await mapsClient
      .placePhoto({
        params: params,
        timeout: 3000, // milliseconds
      })
      .then(response => {
        return response.request.res.responseUrl
      })
      .catch(error => {
        console.log(error)
      })

    data.places[i].properties.image_urls = [
      ...data.places[i].properties.image_urls,
      url,
    ]
    data.places[i].meta.last_updated = timestamp.toISOString()

    fs.writeFile(`${dataDir}${file}`, JSON.stringify(data, null, 2), err => {
      if (err) {
        console.log("Error writing:", err)
      }
    })
  })
}

/*
 * RUN
 *
 */

const dataDir = "./src/data/"
const dataFiles = fs.readdirSync(dataDir)

dataFiles.forEach(file => {
  jsonReader(`${dataDir}${file}`, (err, data) => {
    if (err) {
      console.log("Error reading:", err)
    } else {
      const regex = /(true|tentative|verified, accepts lay residents)/i

      data.places.forEach((place, i) => {
        if (
          place.meta.verified.match(regex) &&
          place.properties.photos?.length
        ) {
          console.log(`Getting photos for: ${place.properties.name}`)
          addImageData(file, data, i, place.properties.photos)

          setTimeout(() => {}, 3000)
        }
      })
    }
  })
})
