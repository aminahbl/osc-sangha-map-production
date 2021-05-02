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

const zeroPad = (num, places) => String(num).padStart(places, "0")

/*
 * MAIN
 *
 */

const rootDir = "./src/"
const dataSrcDir = "data/initial-data-fetch/"
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
    let updatedData = { ...data }

    if (error) {
      console.log("Error reading:", error)
    } else {
      data.places.forEach((place, placeIndex) => {
        let updatedPlaceValues = {
          monastics: [""],
          images: [""],
          video: [""],
          audio: [""],
        }
        Object.assign(
          updatedData.places[placeIndex].properties,
          updatedPlaceValues
        )
        updatedData.places[
          placeIndex
        ].meta.last_updated = timestamp.toISOString()
      })

      const productionPlaces = updatedData.places.filter(place =>
        place.meta.verified.match(regex)
      )
      const productionData = { places: [...productionPlaces] }
      fs.writeFile(
        `${rootDir}${productionDir}${productionFile}${zeroPad(
          fileIndex + 1,
          2
        )}${ext}`,
        JSON.stringify(productionData, null, 2),
        error => {
          if (error) {
            console.log("Error writing:", error)
          }
        }
      )

      const storedPlaces = updatedData.places.filter(
        place => !place.meta.verified.match(regex)
      )
      const storedData = { places: [...storedPlaces] }
      fs.writeFile(
        `${rootDir}${storedDir}${storedFile}${zeroPad(fileIndex + 1, 2)}${ext}`,
        JSON.stringify(storedData, null, 2),
        error => {
          if (error) {
            console.log("Error writing:", error)
          }
        }
      )
    }
  })
})
