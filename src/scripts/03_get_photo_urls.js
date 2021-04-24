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

function getPhotoURLs() {
    // TODO
}

/*
 * CALLS
 *
 */

const dataDir = "./src/data-test/"
const dataFiles = fs.readdirSync(dataDir)

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
           1. photoURLs = getPhotoURLs()
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
