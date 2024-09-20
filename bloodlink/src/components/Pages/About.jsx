import React, { useEffect } from 'react';
import './About.css';
import sandeep from '../../assets/images/sandeep.jpg'
import rajkumar from '../../assets/images/rajkumar.jpg'
import ashish from '../../assets/images/ashish.jpg'
import bed from '../../assets/images/bed.jpg'
import anup from '../../assets/images/anup.jpg'
const About = () => {
    useEffect(()=>{
        window.scrollTo(0, 0);
      },[])
  return (
    <div className="about-container">
      <section className="about-section">
        <h2>About Us</h2>
        <p>
          Our college project aims to promote awareness about blood donation and facilitate the process of finding donors. 
          We strive to provide a platform that connects those in need with willing donors, ensuring timely and efficient support.
        </p>
      </section>

      <section className="founders-section">
        <div><h2>Our Team</h2></div>
        <div className="founder-list">
          <div className="founder-card">
            <div className="founder-image-wrapper">
              <img src={sandeep} alt="Founder 1" className="founder-image" />
            </div>
            <div className="founder-details">
              <h3>Sandeep Tharu</h3>
            </div>
          </div>

          <div className="founder-card">
            <div className="founder-image-wrapper">
              <img src={rajkumar} alt="Founder 2" className="founder-image" />
            </div>
            <div className="founder-details">
              <h3>Raj Kumar Ray</h3>
            </div>
          </div>
          <div className="founder-card">
            <div className="founder-image-wrapper">
              <img src={ashish} alt="Founder 3" className="founder-image" />
            </div>
            <div className="founder-details">
              <h3>Ashish Tharu</h3>
            </div>
          </div>
          <div className="founder-card">
            <div className="founder-image-wrapper">
              <img src={bed} alt="Founder 5" className="founder-image" />
            </div>
            <div className="founder-details">
              <h3>Bed Prasad Kandel</h3>
            </div>
          </div>
          <div className="founder-card">
            <div className="founder-image-wrapper">
              <img src={anup} alt="Founder 5" className="founder-image" />
            </div>
            <div className="founder-details">
              <h3>Anup Pacchai</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;