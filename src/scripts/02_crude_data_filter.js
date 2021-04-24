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

/*
 * CALLS
 *
 */

const dataDir = "./src/data/"
const dataFiles = fs.readdirSync(dataDir)

dataFiles.forEach(file => {
  jsonReader(`${dataDir}${file}`, (err, data) => {
    if (err) {
      console.log("Error reading:", err)
    } else {

      const regex = /(\bhindu\b|benedictine|\bst\b)/i
      const timestamp = new Date()

      data.places.forEach((place, i) => {
        if (place.properties.name.match(regex)) {
          data.places[i].meta.verified = "marked for removal"
          data.places[i].meta.last_updated = timestamp.toISOString()
        }
      })

      fs.writeFile(
        `${dataDir}${file}`,
        JSON.stringify(data, null, 2),
        err => {
          if (err) {
            console.log("Error writing:", err)
          }
        }
      )
    }
  })
})
