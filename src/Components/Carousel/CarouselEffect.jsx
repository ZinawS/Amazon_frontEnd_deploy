import "react-responsive-carousel/lib/styles/carousel.min.css"; // required
import { Carousel } from "react-responsive-carousel";
import carouselImage from "./imageData";

import classes from "./carousel.module.css";

function CarouselEffect() {
  return (
    <div>
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showIndicators={false}
        showStatus={false}
      >
        {carouselImage.map((image) => {
          return <img src={image} alt="" />;
        })}
      </Carousel>
      <div className={classes.hero_img}></div>
    </div>
  );
}

export default CarouselEffect;
