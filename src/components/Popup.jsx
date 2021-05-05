import React from "react"
import Gallery from "./Gallery"
import CloseIcon from "../images/icons/icon-close-cross.inline.svg"
import {
  popupContainerClass,
  popupInnerClass,
  popupBodyClass,
  closeButtonClass,
  closeButtonIconClass,
} from "./Popup.module.scss"
import {
  infoWindowHeaderClass,
  infoWindowHeadingClass,
  popupModClass,
} from "./SanghaMap.module.scss"

const Popup = ({ popupInfo, resetTrigger }) => {
  return (
    <div className={popupContainerClass}>
      <div className={popupInnerClass}>
        <span
          className={closeButtonClass}
          role="button"
          aria-label="Close info popup"
          onClick={() => resetTrigger(false)}
        >
          <CloseIcon className={closeButtonIconClass} />
        </span>
        <div>
          <header className={`${infoWindowHeaderClass} ${popupModClass}`}>
            <h2 className={infoWindowHeadingClass}>
              {popupInfo.properties.name}
            </h2>
          </header>
          <div className={popupBodyClass}>
            <address>
              <p>
                {popupInfo.properties.formatted_address &&
                  popupInfo.properties.formatted_address.replace("/,/g", "\\n")}
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
            {popupInfo.properties.images[0] && (
              <Gallery
                images={popupInfo.properties.images}
                placeName={popupInfo.properties.name}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
