import React from "react"
import Gallery from "./Gallery"
import CloseIcon from "../images/icons/icon-close-cross.inline.svg"
import {
  popupContainerClass,
  popupInnerWrapperClass,
  closeButtonWrapperClass,
  popupBodyClass,
  popupHeaderClass,
  popupHeadingClass,
  detailsHeadingClass,
  detailsSubHeadingClass,
  closeButtonClass,
  closeButtonIconClass,
} from "./Popup.module.scss"

const Popup = ({ popupInfo, resetTrigger }) => {
  return (
    <div className={popupContainerClass}>
      <div className={popupInnerWrapperClass}>
        <div
          className={closeButtonWrapperClass}
        >
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
            <h2 className={popupHeadingClass}>
              {popupInfo.properties.name}
            </h2>
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
                <h4 className={detailsSubHeadingClass}>Tradition</h4>
                <p>{popupInfo.properties.tradition}</p>
              </>
            )}
            <h4 className={detailsHeadingClass}>About</h4>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
              neque perspiciatis praesentium ab sed cupiditate exercitationem
              natus in quas? Repellendus totam eaque veniam? Magnam, nemo!
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident voluptatibus nemo exercitationem expedita mollitia, rerum dolores dolore iste necessitatibus similique nam omnis assumenda eaque recusandae eius reiciendis ratione officia corporis aperiam dolor. Vel rem ipsa qui minima sunt libero obcaecati laudantium, sequi deleniti, assumenda amet provident nostrum. Quia, rerum necessitatibus!
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam dignissimos voluptate expedita vero fuga voluptatem, magni, non laborum quas ut repudiandae alias aspernatur perspiciatis doloremque asperiores accusamus autem impedit a quia beatae iste officiis at! Officia fugiat maiores repellendus amet? Cupiditate est accusantium quam ipsum pariatur quo, impedit ea eveniet? Harum natus enim aut! Eum asperiores impedit voluptate nemo quis magni minus voluptatem, adipisci porro doloremque quisquam praesentium aliquid libero reiciendis? Dolores animi ea rem, quas deleniti facere mollitia veniam culpa maxime ipsa eum, nesciunt laudantium totam facilis quos nam eius cumque est. Officiis iure temporibus nulla perspiciatis deserunt aperiam!
            </p>
            {popupInfo.properties.description && (
              <div>{popupInfo.properties.description}</div>
            )}
            {popupInfo.properties.images[0] && (
              <Gallery
                images={popupInfo.properties.images}
                placeName={popupInfo.properties.name}
              />
            )}

            <h4 className={detailsSubHeadingClass}>Monastics</h4>
            {popupInfo.properties.monastics[0] &&
              popupInfo.properties.monastics.map((monastic, i) => (
                <p key={`monastic-${i}`}>{monastic}</p>
              ))}
            {popupInfo.properties.description && (
              <div>{popupInfo.properties.description}</div>
            )}
            <h4 className={detailsHeadingClass}>Teachings</h4>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
