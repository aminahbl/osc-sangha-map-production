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

  return mapsClient
    .placePhoto({
      params: params,
      timeout: 3000, // milliseconds
    })
    .then(response => response.request.res.responseUrl)
    .catch(error => {
      console.log(error)
    })
}

async function processPhotoRefs(photos) {
  let placeImages = []

  for (const photo of photos) {
    try {
      const response = await getURL(photo.photo_reference)
      //TODO: proper http error handling
      // console.log(`Response: ${response}`)
      // if (response.status !== 200) {
      //   throw new Error(`HTTP error status: ${response.status}`)
      // }
      placeImages.push(response)
    } catch (err) {
      console.log(`Yikes, processing photo refs failed! ${err}`)
    }
  }

  return placeImages
}

function writeUpdatedProdData(updateData, fileIndex) {
  try {
    const updatedProductionPlaces = updateData.places.filter(place =>
      place.meta.verified.match(regex)
    )
    const updatedProductionData = { places: [...updatedProductionPlaces] }
    console.log(`Writing prod data in new file ${zeroPad(fileIndex + 1, 2)}`)
    fs.writeFile(
      `${rootDir}${productionDir}${productionFile}${zeroPad(
        fileIndex + 1,
        2
      )}${ext}`,
      JSON.stringify(updatedProductionData, null, 2),
      error => {
        if (error) {
          console.log("Error writing:", error)
        }
      }
    )
  } catch (err) {
    console.log(
      `Crumbs, writing updated production data failed! ${err}`
    )
  }
}

const zeroPad = (num, places) => String(num).padStart(places, "0")

/*
 * MAIN
 *
 */

const rootDir = "./src/"
const dataSrcDir = "data-test/"
const productionDir = "data/production/"
const productionFile = "production_"
const storedDir = "data/stored/"
const storedFile = "stored_"
const ext = ".json"
const dataFiles = fs.readdirSync(`${rootDir}${dataSrcDir}`)
const regex = /(true|tentative|verified, accepts lay residents)/i
const timestamp = new Date()

dataFiles.forEach((file, fileIndex) => {
  jsonReader(`${rootDir}${dataSrcDir}${file}`, (error, data) => {
    let updatedProductionData = { ...data }
    let updatedStoredData = { ...data }

    if (error) {
      console.log("Error reading:", error)
    } else {
      data.places.forEach(async (place, placeIndex) => {
        if (
          place.meta.verified.match(regex) &&
          place.properties.photos?.length
        ) {
          try {
            const placeImages = await processPhotoRefs(place.properties.photos)

            const updatedProdPlaceValues = {
              monastics: [""],
              images: [...placeImages],
              video: [""],
              audio: [""],
            }

            console.log(`\nfile: ${file}\nplaceIndex: ${placeIndex}\n`)

            Object.assign(
              updatedProductionData.places[placeIndex].properties,
              updatedProdPlaceValues
            )

            delete updatedProductionData.places[placeIndex].properties.photos

            updatedProductionData.places[
              placeIndex
            ].meta.last_updated = timestamp.toISOString()

            writeUpdatedProdData(updatedProductionData, fileIndex)
          } catch (err) {
            console.log(
              `Oh my, something's happened getting place Images! ${err}`
            )
          }
        } else {
          const updatedStoredPlaceValues = {
            monastics: [""],
            video: [""],
            audio: [""],
          }
          Object.assign(
            updatedStoredData.places[placeIndex].properties,
            updatedStoredPlaceValues
          )

          updatedStoredData.places[
            placeIndex
          ].meta.last_updated = timestamp.toISOString()
        }
      })

      updatedStoredPlaces = updatedStoredData.places.filter(
        place => !place.meta.verified.match(regex)
      )
      updatedStoredData = { places: [...updatedStoredPlaces] }
      fs.writeFile(
        `${rootDir}${storedDir}${storedFile}${zeroPad(fileIndex + 1, 2)}${ext}`,
        JSON.stringify(updatedStoredData, null, 2),
        error => {
          if (error) {
            console.log("Error writing:", error)
          }
        }
      )
    }
  })
})
