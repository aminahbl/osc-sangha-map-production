import React from "react"
import InfoButtonIcon from "../assets/images/icon-info-button.inline.svg"
import {
  infoWindowContainerClass,
  infoWindowHeaderClass,
  infoWindowHeadingClass,
  longTingClass,
  infoWindowImageWrapperClass,
  infoWindowImageClass,
  infoButtonClass,
  infoButtonIconClass,
} from "./InfoWindowPanel.module.scss"

const InfoWindowPanel = ({ coverImg, properties, handleInfoClick }) => {
  let titleClass = infoWindowHeadingClass
  if (properties.name.length > 50) {
    titleClass = `${infoWindowHeadingClass} ${longTingClass}`
  }
  
  return (
    <div className={infoWindowContainerClass}>
      <header className={infoWindowHeaderClass}>
        <h2 className={titleClass}>{properties.name}</h2>
      </header>

      <div className={infoWindowImageWrapperClass}>
        {/* <StaticImage src="https://lh5.googleusercontent.com/p/AF1QipNSwhhx8ApXsGZpkiN4oSqanx35cpdahPgam0hv=w600-h321-p-k-no" alt /> */}
        <img
          className={infoWindowImageClass}
          src={coverImg}
          alt={properties.name}
        />

        <span
          className={infoButtonClass}
          role="button"
          aria-label="More information"
          onClick={() => handleInfoClick()}
        >
          <InfoButtonIcon className={infoButtonIconClass} />
        </span>
      </div>
    </div>
  )
}

export default InfoWindowPanel
