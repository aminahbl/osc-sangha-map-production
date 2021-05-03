import React, { useState, useRef, useCallback, useMemo } from "react"
import { useStaticQuery, graphql } from "gatsby"
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api"
import "@reach/combobox/styles.css"
import mapStyles from "../styles/mapStyles"
import buddhaMarker from "../images/markers/buddha-marker.png"
import dhammaMarker from "../images/markers/dhamma-marker.png"
import sanghaMarker from "../images/markers/sangha-marker.png"
import communityMarker from "../images/markers/community-marker.png"
import infoStandinCover from "../images/info-standin-cover.svg"
import InfoButtonIcon from "../images/icon-info-button.inline.svg"
import {
  infoWindowContainerClass,
  infoWindowHeaderClass,
  infoWindowBodyClass,
  infoWindowImageWrapperClass,
  infoWindowImageClass,
  infoWindowHeadingClass,
  infoButtonClass,
  infoButtonIconClass,
} from "./SanghaMap.module.scss"

export const jsonDataQuery = graphql`
  query geJsonDataQuery {
    allProductionJson {
      nodes {
        places {
          properties {
            description
            formatted_address
            geometry {
              location {
                lat
                lng
              }
            }
            international_phone_number
            name
            place_id
            website
            images 
          }
          meta {
            verified
          }
        }
      }
    }
  }
`

const libraries = ["places"]
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
}
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
}
const center = {
  lat: 14.299,
  lng: 155.0725,
}

const SanghaMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const [selected, setSelected] = useState(null)

  const mapRef = useRef()
  const onMapLoad = useCallback(map => {
    mapRef.current = map
  }, [])

  const data = useStaticQuery(jsonDataQuery)

  const getAllPlaces = () => {
    let accumulated = []

    const regex = /(duplicate|false|remove)/i

    data.allProductionJson.nodes.map(node => {
      node.places.forEach(place => {
        if (place.meta.verified.match(regex)) {
          return
        }
        accumulated.push(place)
      })
    })
    return accumulated
  }

  const allPlaces = useMemo(() => {
    return getAllPlaces()
  }, [])

  function createKey(location) {
    return location.lat + location.lng
  }

  if (loadError) {
    return "Error"
  }
  if (!isLoaded) {
    return "Loading..."
  }

  return (
    <div>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={3}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        <MarkerClusterer styles={clusterStyles}>
          {clusterer =>
            allPlaces.map(place => {
              const {
                properties: {
                  geometry: {
                    location: { lat, lng }
                  },
                },
                meta: { verified },
              } = place

              let placeMarker
              let iconSize = [30, 30]
              switch (verified) {
                case "verified, accepts lay residents":
                  placeMarker = communityMarker
                  iconSize = [45, 45]
                  break
                default:
                  placeMarker = sanghaMarker
              }

              const infoCoverImg = place.properties?.images[0] ? place.properties?.images[0] : infoStandinCover

              return (
                <Marker
                  key={createKey(place.properties.geometry.location)}
                  position={{
                    lat: lat,
                    lng: lng,
                  }}
                  clusterer={clusterer}
                  onClick={() => {
                    setSelected({
                      ...place,
                      infoCoverImg: infoCoverImg,
                    })
                  }}
                  icon={{
                    url: placeMarker,
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(
                      iconSize[0],
                      iconSize[1]
                    ),
                  }}
                ></Marker>
              )
            })
          }
        </MarkerClusterer>

        {selected && (
          <InfoWindow
            position={{
              lat: selected.properties.geometry.location.lat,
              lng: selected.properties.geometry.location.lng,
            }}
            onCloseClick={() => {
              setSelected(null)
            }}
          >
            <div className={infoWindowContainerClass}>
              <header className={infoWindowHeaderClass}>
                <h2 className={infoWindowHeadingClass}>
                  {selected.properties.name}
                </h2>
              </header>
              <div className={infoWindowImageWrapperClass}>
                <img
                  className={infoWindowImageClass}
                  src={selected.infoCoverImg}
                  alt={selected.properties.name}
                />
                <span
                  className={infoButtonClass}
                  role="button"
                  aria-label="More information"
                >
                  <InfoButtonIcon className={infoButtonIconClass} />
                </span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}

export default SanghaMap

/*
 * STYLES
 *
 */

const clusterStyles = [
  {
    url: dhammaMarker,
    height: 30,
    width: 30,
    fontFamily: "Lato",
    fontWeight: "900",
    textColor: "#0b0925",
  },
  {
    url: dhammaMarker,
    height: 60,
    width: 60,
    fontFamily: "Lato",
    fontWeight: "900",
    textColor: "#0b0925",
  },
  {
    url: dhammaMarker,
    height: 80,
    width: 80,
    fontFamily: "Lato",
    fontWeight: "900",
    textColor: "#0b0925",
  },
  {
    url: dhammaMarker,
    height: 100,
    width: 100,
    fontFamily: "Lato",
    fontWeight: "900",
    textColor: "#0b0925",
  },
  {
    url: dhammaMarker,
    height: 120,
    width: 120,
    fontFamily: "Lato",
    fontWeight: "900",
    textColor: "#0b0925",
  },
]
