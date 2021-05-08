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
  popupAddressClass,
  detailsHeadingClass,
  detailsSubHeadingClass,
  galleryContainerClass,
} from "./Popup.module.scss"

const Popup = ({ popupInfo, resetTrigger }) => {
  let PlaceName

  if (popupInfo.name.match(/(^.*?)(\W{2,}.*$)/)) {
    const placeNameParts = popupInfo.name.match(/(^.*?)(\W{2,}.*$)/)
    PlaceName = () => (
      <>
        {placeNameParts[1]}
        <br />
        {placeNameParts[2]}
      </>
    )
  }

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
            <h2 className={popupHeadingClass}>{PlaceName ? <PlaceName /> : popupInfo.name}</h2>
            <address className={popupAddressClass}>
              <p>
                {popupInfo.address &&
                  popupInfo.address}
                <br />
                {popupInfo.phone &&
                  popupInfo.phone}
                <br />
                {popupInfo.website && (
                  <a
                    href={popupInfo.website}
                    target="_blank"
                    rel="noopener nofollow"
                  >
                    {popupInfo.website}
                  </a>
                )}
              </p>
            </address>
          </header>
          <div className={popupBodyClass}>
            {popupInfo.tradition && (
              <>
                <h3 className={detailsSubHeadingClass}>Tradition</h3>
                <p>{popupInfo.tradition}</p>
              </>
            )}

            {popupInfo.monastics[0] && (
              <>
                <h3 className={detailsSubHeadingClass}>Monastics</h3>
                <p>
                  {popupInfo.monastics.map((monastic, i) => (
                    <>
                      <span key={`monastic-${i}`}>{monastic}</span>
                      {i + 1 < popupInfo.monastics.length
                        ? "; "
                        : "."}
                    </>
                  ))}
                </p>
              </>
            )}

            {popupInfo.description[0] && (
              <>
                <h3 className={detailsHeadingClass}>About</h3>
                <div>{popupInfo.description}</div>
              </>
            )}

            {popupInfo.images[0] && (
              <>
                <h3 className={detailsHeadingClass}>Images / Teachings</h3>
                <div className={galleryContainerClass}>
                  <Gallery
                    images={popupInfo.images}
                    placeName={popupInfo.name}
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
