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
 * MAIN
 *
 */

const rootDir = "./src/"
const productionSrcDir = "data/production/"
const dataSrcFiles = fs.readdirSync(`${rootDir}${productionSrcDir}`)
const timestamp = new Date()

dataSrcFiles.forEach(file => {
  jsonReader(`${dataSrcFiles}${file}`, (error, data) => {
    let newDataObj = { places = []}

    if (error) {
      console.log("Error reading:", error)
    } else {
      data.places.forEach(place => {
        const {
          properties: {
            formatted_address,
            geometry: { location},
            international_phone_number,
            name,
            place_id,
            url,
            website = "",
            tradition,
            monastics,
            video,
            audio,
            images,
            meta: {category, notes = [""]}
          }
        } = place

        let newPlaceObject = {
          name: name,
          location: location,
          address: formatted_address,
          phone: international_phone_number,
          website: website,
          tradition: tradition,
          monastics: monastics,
          description: [""],
          images: images,
          video: video,
          audio: audio,
          google_place_id: place_id,
          google_maps_url: url,
          category: category, 
          last_updated: timestamp.toISOString(), 
          notes: notes
        }

        newDataObj.places.push(newPlaceObject)
      })


      fs.writeFile(
        `${dataSrcFiles}${file}`,
        JSON.stringify(newDataObj, null, 2),
        error => {
          if (error) {
            console.log("Error writing:", error)
          }
        }
      )
    }
  })
})
