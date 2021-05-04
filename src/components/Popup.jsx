import React from "react"
import CloseIcon from "../images/icons/icon-close-cross.inline.svg"
import {
  popupClass,
  popupInnerClass,
  closeButtonClass,
  closeButtonIconClass
} from "./Popup.module.scss"

const Popup = props => {
  return (
    props.trigger && (
      <div className={popupClass}>
        <div className={popupInnerClass}>
          <span
            className={closeButtonClass}
            role="button"
            aria-label="Close info popup"
            onClick={() => props.setTrigger(false)}
          >
            <CloseIcon className={closeButtonIconClass} />
          </span>
          {props.children}
        </div>
      </div>
    )
  )
}

export default Popup
