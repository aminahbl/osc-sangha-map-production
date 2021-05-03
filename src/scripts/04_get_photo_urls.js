const fs = require("fs")
const { Client } = require("@googlemaps/google-maps-services-js")

const rootDir = "./src/"
const dataSrcDir = "data-test/production/"
const dataFiles = fs.readdirSync(`${rootDir}${dataSrcDir}`)
const workingFile = dataFiles[1]
const timestamp = new Date()

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
    .catch(err => {
      console.log(err)
    })
}

function methodThatReturnsAPromise(place) {
  return new Promise((resolvePlace, reject) => {
    console.log(`---Processing ${place.properties.name}---`)
    if (place.properties.photos) {
      let fetchPlaceImages = new Promise((resolveImgs, reject) => {
        let images = []
        async function getImages() {
          for (const photo of place.properties.photos) {
            await sleep(3000)
            console.log(`Getting a photo for ${place.properties.name}`)

            let fetchAnImage = new Promise(async (resolveImg, reject) => {
              try {
                const imgURL = await getURL(photo.photo_reference)

                resolveImg(imgURL)
              } catch (err) {
                console.log(`Yikes, processing photo refs failed! ${err}`)
              }
            })

            fetchAnImage
              .then(image => images.push(image))
              .catch(err => console.error(err))
            console.log("Having a nap…")
          }
        }
        getImages()
          .then(() => resolveImgs(images))
          .catch(err => console.error(err))
      })

      fetchPlaceImages.then(placeImages => {
        console.log(`\nGot images for ${place.properties.name}\n`)
        console.dir(placeImages)

        place.properties.images = [...placeImages]
        delete place.properties.photos

        place.meta.last_updated = timestamp.toISOString()
        resolvePlace(place)
      })
    } else {
      resolvePlace(place)
    }
  })
}

jsonReader(`${rootDir}${dataSrcDir}${workingFile}`, (error, fileData) => {
  if (error) {
    console.log("Error reading:", error)
  } else {

    let result = fileData.places.reduce((accumulatorPromise, place) => {
      return accumulatorPromise.then(() => {
        return methodThatReturnsAPromise(place)
      })
    }, Promise.resolve())

    result
      .then(resolution => {
        fs.writeFile(
          `${rootDir}${dataSrcDir}${workingFile}`,
          JSON.stringify({ places: [resolution] }, null, 2),
          err => {
            if (err) {
              console.log(
                `Oh my, something happened writing ${rootDir}${dataSrcDir}${file}! ${err}`
              )
            }
          }
        )
      })
      .catch(err => {
        console.log(err)
      })
  }
})
