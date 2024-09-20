import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HeroCarousel.css';
import slide1 from '../../assets/images/slide1.jpg';
import slide2 from '../../assets/images/slide2.jpg';
import slide3 from '../../assets/images/slide3.jpg';
import donateblood from "../../assets/videos/donateblood.mp4"
const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        interval={6000}
      >
        {/* <div className="slide"> */}
          {/* <video src={donateblood} type="video/mp4" autoPlay loop muted/> */}
          {/* <img src={slide1} alt="Slide 1" /> */}
        {/* </div> */}
        <div className="slide">
          <img src={slide1} alt="Slide 2" />
        </div>
        <div className="slide">
          <img src={slide2} alt="Slide 3" />
        </div>
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
