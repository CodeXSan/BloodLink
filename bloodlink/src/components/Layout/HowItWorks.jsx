import React from 'react';
import './HowItWorks.css';
import icon1 from '../../assets/images/icon-5.png';
import icon2 from '../../assets/images/icon-2.png';
import icon3 from '../../assets/images/icon-3.png';
import icon4 from '../../assets/images/icon-6.png';

const HowItWorks = () => {
  return (
    <div className="bg_gray_light py-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 text-center">
            <h2 className="mb-4">How it works</h2>
            <ul className="progress_m1 list-unstyled d-flex justify-content-between align-items-center">
              <li className="text-center position-relative">
                <img src={icon1} alt="Fill request form" />
                <span className="connector"></span>
                <p>Fill request form</p>
              </li>
              <li className="text-center position-relative active">
                <img src={icon2} alt="Donors will be notified" />
                <span className="connector"></span>
                <p>Donors will be notified</p>
              </li>
              <li className="text-center position-relative">
                <img src={icon3} alt="Donors will update availability" />
                <span className="connector"></span>
                <p>Donors will update availability</p>
              </li>
              <li className="text-center position-relative">
                <img src={icon4} alt="Contact the available donors" />
                <p>Contact the available donors</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
