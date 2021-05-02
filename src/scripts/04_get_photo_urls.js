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
// sleep(8000).then(async () => {
//   Do something after the sleep!
// })

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

async function processPhotoRefs(file, fileData, placeIndex, placeName, photos) {
  let updatedFileData = { ...fileData }
  let placeImages = []

  console.log(`\nWorking on ${placeName}\n`)

  for (const photo of photos) {
    console.log(`\nGetting another photo\n`)

    try {
      const response = await getURL(photo.photo_reference)
      //TODO: proper http error handling
      // console.log(`Response: ${response}`)
      // if (response.status !== 200) {
      //   throw new Error(`HTTP error status: ${response.status}`)
      // }

      placeImages.push(response).then(() => {
        updatedFileData.places[placeIndex].properties.images = [...placeImages]
        delete updatedFileData.places[placeIndex].properties.photos

        updatedFileData.places[
          placeIndex
        ].meta.last_updated = timestamp.toISOString()

        console.log(`\nWriting updated ${rootDir}${dataSrcDir}${file}\n`)

        fs.writeFile(
          `${rootDir}${dataSrcDir}${file}`,
          JSON.stringify(updatedFileData, null, 2),
          err => {
            if (err) {
              console.log(
                `Oh my, something happened writing ${rootDir}${dataSrcDir}${file}! ${err}`
              )
            }
          }
        )

        return updatedFileData
      })
    } catch (err) {
      console.log(`Yikes, processing photo refs failed! ${err}`)
    }
  }
}

/*
 * MAIN
 *
 */

const rootDir = "./src/"
const dataSrcDir = "data-test/production/"
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

            const updatedData = await processPhotoRefs(
              file,
              updatedFileData,
              placeIndex,
              place.properties.name,
              place.properties.photos
            )

            console.log(`\nGot updated data from ${place.properties.name}`)

            updatedFileData = { ...updatedData }
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
