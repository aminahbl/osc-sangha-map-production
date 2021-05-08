import React from "react"
import Gallery from "./Gallery"
import CloseIcon from "../assets/images/icons/icon-close-cross.inline.svg"
import {
  popupContainerClass,
  popupInnerWrapperClass,
  closeButtonWrapperClass,
  closeButtonClass,
  closeButtonIconClass,
  popupBodyClass,
  popupHeaderClass,
  popupHeadingClass,
  detailsHeadingClass,
  detailsSubHeadingClass,
  galleryContainerClass,
} from "./Popup.module.scss"

const Popup = ({ popupInfo, resetTrigger }) => {
  return (
    <div className={popupContainerClass}>
      <div className={popupInnerWrapperClass}>
        <div className={closeButtonWrapperClass}>
          <span
            className={closeButtonClass}
            role="button"
            aria-label="Close info popup"
            onClick={() => resetTrigger(false)}
          >
            <CloseIcon className={closeButtonIconClass} />
          </span>
        </div>
        <div>
          <header className={popupHeaderClass}>
            <h2 className={popupHeadingClass}>{popupInfo.properties.name}</h2>
            <address>
              <p>
                {popupInfo.properties.formatted_address &&
                  popupInfo.properties.formatted_address}
                <br />
                {popupInfo.properties.international_phone_number &&
                  popupInfo.properties.international_phone_number}
                <br />
                {popupInfo.properties.website && (
                  <a
                    href={popupInfo.properties.website}
                    target="_blank"
                    rel="noopener nofollow"
                  >
                    {popupInfo.properties.website}
                  </a>
                )}
              </p>
            </address>
          </header>
          <div className={popupBodyClass}>
            {popupInfo.properties.tradition && (
              <>
                <h3 className={detailsSubHeadingClass}>Tradition</h3>
                <p>{popupInfo.properties.tradition}</p>
              </>
            )}

            {popupInfo.properties.monastics[0] && (
              <>
                <h3 className={detailsSubHeadingClass}>Monastics</h3>
                <p>
                  {popupInfo.properties.monastics.map((monastic, i) => (
                    <>
                      <span key={`monastic-${i}`}>{monastic}</span>
                      {i + 1 < popupInfo.properties.monastics.length
                        ? "; "
                        : "."}
                    </>
                  ))}
                </p>
              </>
            )}

            {popupInfo.properties.description && (
              <>
                <h3 className={detailsHeadingClass}>About</h3>
                <div>{popupInfo.properties.description}</div>
              </>
            )}

            {popupInfo.properties.images[0] && (
              <>
                <h3 className={detailsHeadingClass}>Images / Teachings</h3>
                <div className={galleryContainerClass}>
                  <Gallery
                    images={popupInfo.properties.images}
                    placeName={popupInfo.properties.name}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
