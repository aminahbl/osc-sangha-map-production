import React from "react"
import Slider from "react-slick"
import Arrrow from "../assets/images/icons/icon-right-chevron.inline.svg"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { imageContainerClass, imageClass } from "./Gallery.module.scss"

function NextArrow(props) {
  const { className, style, onClick } = props
  return (
    <Arrrow
      className={className}
      style={{ ...style, display: "block", paddingLeft: ".75rem" }}
      onClick={onClick}
    />
  )
}

function PrevArrow(props) {
  const { className, style, onClick } = props
  return (
    <Arrrow
      className={className}
      style={{
        ...style,
        display: "block",
        paddingLeft: ".75rem",
        transform: "rotate(180deg)",
      }}
      onClick={onClick}
    />
  )
}

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
}

const Gallery = ({ images, placeName }) => {
  return (
    <Slider {...sliderSettings}>
      {images.map((image, i) => (
        <div className={imageContainerClass}>
          <img
            className={imageClass}
            key={`current-place-${i}`}
            src={image}
            alt={placeName}
          />
        </div>
      ))}
    </Slider>
  )
}

export default Gallery
