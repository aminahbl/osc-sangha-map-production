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

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

const zeroPad = (num, places) => String(num).padStart(places, "0")

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
      timeout: 30000, // milliseconds
    })
    .then(response => response.request.res.responseUrl)
    .catch(err => {
      console.log(err)
    })
}

async function processPhotoRefs(photos) {
  let placeImages = []

  for (const photo of photos) {
    sleep(8000).then(async () => {
      // Do something after the sleep!

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
    })
  }

  return placeImages
}

// function writeUpdatedProdData(updateData, fileIndex) {
//   try {
//     const updatedProductionPlaces = updateData.places.filter(place =>
//       place.meta.verified.match(regex)
//     )
//     const updatedProductionData = { places: [...updatedProductionPlaces] }
//     console.log(`Writing prod data in new file ${zeroPad(fileIndex + 1, 2)}`)
//     fs.writeFile(
//       `${rootDir}${productionDir}${productionFile}${zeroPad(
//         fileIndex + 1,
//         2
//       )}${ext}`,
//       JSON.stringify(updatedProductionData, null, 2),
//       err => {
//         if (err) {
//           console.log("Error writing:", err)
//         }
//       }
//     )
//   } catch (err) {
//     console.log(`Crumbs, writing updated production data failed! ${err}`)
//   }
// }

/*
 * MAIN
 *
 */

const rootDir = "./src/"
const dataSrcDir = "data/production/"
const dataFiles = fs.readdirSync(`${rootDir}${dataSrcDir}`)
const timestamp = new Date()

dataFiles.forEach((file, fileIndex) => {
  jsonReader(`${rootDir}${dataSrcDir}${file}`, (error, fileData) => {
    let updatedFileData = { ...fileData }

    if (error) {
      console.log("Error reading:", error)
    } else {
      fileData.places.forEach(async (place, placeIndex) => {
        if (place.properties.photos) {
          try {
            console.log(`\nfile: ${file}\nplaceIndex: ${placeIndex}\n`)

            const placeImages = await processPhotoRefs(place.properties.photos)
            updatedFileData.places[placeIndex].properties.images = [
              ...placeImages,
            ]
            delete updatedFileData.places[placeIndex].properties.photos

            updatedFileData.places[
              placeIndex
            ].meta.last_updated = timestamp.toISOString()

            fs.writeFile(
              `${rootDir}${dataSrcDir}${file}`,
              JSON.stringify(updatedFileData, null, 2),
              err => {
                if (err) {
                  console.log(`Oh my, something happened writing ${rootDir}${dataSrcDir}${file}! ${err}`)
                }
              }
            )
          } catch (err) {
            console.log(
              `Crumbs, something happened looping through places! ${err}`
            )
          }
        }
      })
    }
  })
})
