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
    .catch(error => {
      console.log(error)
    })
}

async function processPhotoRefs(photos) {
  let placeImages = []

  for (const photo of photos) {
    await sleep(3000)
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

function writeUpdatedProdData(updateData, file) {
  try {
    console.log(`Writing data in ${file}`)
    fs.writeFile(
      `${rootDir}${dataSrcDir}${file}`,
      JSON.stringify(updateData, null, 2),
      error => {
        if (error) {
          console.log("Error writing:", error)
        }
      }
    )
  } catch (err) {
    console.log(`Crumbs, writing updated production data failed! ${err}`)
  }
}

/*
 * MAIN
 *
 */

const rootDir = "./src/"
const dataSrcDir = "data/production/"
const files = fs.readdirSync(`${rootDir}${dataSrcDir}`)
const workingFile = files[44]

const timestamp = new Date()

jsonReader(`${rootDir}${dataSrcDir}${workingFile}`, (error, data) => {
  let workingData = { ...data }

  if (error) {
    console.log("Error reading:", error)
  } else {
    workingData.places.forEach((place, i) => {
      let fetchPlaceImages = new Promise(async (resolveImgFetch, reject) => {
        if (place.properties.photos) {
          try {
            const placeImages = await processPhotoRefs(place.properties.photos)

            console.log(`\n--- Place: ${place.properties.name} ---\n`)
            // console.dir(placeImages)
            resolveImgFetch({ imgs: placeImages, placeIndex: i })
          } catch (err) {
            console.log(
              `Oh my, something's happened looping through places! ${err}`
            )
          }
        }
      })
      fetchPlaceImages
        .then(resolvedImgs => {
          console.log(`\nGot images for ${place.properties.name}:\n`)
          console.dir(resolvedImgs)

          workingData.places[resolvedImgs.placeIndex].properties.images = [
            ...resolvedImgs.imgs,
          ]

          delete workingData.places[resolvedImgs.placeIndex].properties.photos

          workingData.places[
            resolvedImgs.placeIndex
          ].meta.last_updated = timestamp.toISOString()
          return workingData
        })
        .then(workingData => {
          writeUpdatedProdData(workingData, workingFile)
        })
        .catch(err => console.error(err))
    })
  }
})
