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

function getURL(photoRef) {
  const mapsClient = new Client({})

  let params = {
    key: "",
    photoreference: photoRef,
    maxwidth: 800,
    maxheight: 800,
  }

  const result = mapsClient
    .placePhoto({
      params: params,
      timeout: 3000, // milliseconds
    })
    .then(response => response.request.res.responseUrl)
    .catch(error => {
      console.log(error)
    })

  return result
}

function getImageData(photos) {
  let placeImages = []

  for (const photo of photos) {
    const imageURL = getURL(photo.photo_reference)
    imageURL.then(url => {
      console.log(`Current image url: ${url}`)
      placeImages.push(url)
    })
  }

  console.log(`Current place images: ${placeImages}`)
  return placeImages
}

/*
 * MAIN
 *
 */

const dataDir = "./src/data-test/"
const dataFiles = fs.readdirSync(dataDir)

dataFiles.forEach(file => {
  jsonReader(`${dataDir}${file}`, (error, data) => {
    if (error) {
      console.log("Error reading:", error)
    } else {
      let updatedData = { ...data }
      let placeIndex = 0
      const timestamp = new Date()
      const regex = /(true|tentative|verified, accepts lay residents)/i

      for (const place of data.places) {
        if (
          place.meta.verified.match(regex) &&
          place.properties.photos?.length
        ) {
          console.log(`Processing photos for: ${place.properties.name}`)
          const placeImages = getImageData(place.properties.photos)

          if (placeImages.length) {
            updatedData.places[placeIndex].properties.image_urls = [
              ...placeImages,
            ]
          }
          updatedData.places[
            placeIndex
          ].meta.last_updated = timestamp.toISOString()

          console.log(
            `Writing image_urls for: ${updatedData.places[placeIndex].properties.name}`
          )
          fs.writeFile(
            `${dataDir}${file}`,
            JSON.stringify(updatedData, null, 2),
            error => {
              if (error) {
                console.log("Error writing:", error)
              }
            }
          )
        }

        placeIndex += 1
      }
    }
  })
})


