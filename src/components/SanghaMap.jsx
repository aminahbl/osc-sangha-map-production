import React, { useState, useRef, useCallback, useMemo } from "react"
import { graphql } from "gatsby"
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api"
import "@reach/combobox/styles.css"

import InfoWindowPanel from "./InfoWindowPanel"
import Popup from "./Popup"

import { GetPlaceData } from "../hooks/dataQuery"

import buddhaMarker from "../images/markers/buddha-marker.png"
import dhammaMarker from "../images/markers/dhamma-marker.png"
import sanghaMarker from "../images/markers/sangha-marker.png"
import communityMarker from "../images/markers/community-marker.png"
import infoStandinCover from "../images/info-standin-cover.svg"

import mapStyles from "../styles/mapStyles"


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
  const [popup, setPopup] = useState(false)
  const [popupInfo, setPopupInfo] = useState(null)

  const mapRef = useRef()
  const onMapLoad = useCallback(map => {
    mapRef.current = map
  }, [])

  const data = GetPlaceData()

  const getAllPlaces = () => {
    let accumulated = []

    const regex = /(true|tentative|verified, accepts lay residents)/i

    data.map(node => {
      node.places.forEach(place => {
        if (!place.meta.verified.match(regex)) {
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


  const handleInfoClick = () => {
    setPopupInfo(selected)
    setPopup(true)
    setSelected(null)
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
                    location: { lat, lng },
                  },
                  images,
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

              const infoCoverImg = images[0] ? images[0] : infoStandinCover

              return (
                <Marker
                  key={`${lat}-${lng}`}
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
            <InfoWindowPanel
              coverImg={selected.infoCoverImg}
              properties={selected.properties}
              handleInfoClick={handleInfoClick}
            />
          </InfoWindow>
        )}
      </GoogleMap>

      {popup && <Popup popupInfo={popupInfo} resetTrigger={setPopup} />}
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
