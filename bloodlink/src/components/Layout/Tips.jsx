import React from 'react';
import './Tips.css'
const Tips = () => {
  return (
    <div className="container">
      <h1>Tips</h1>
      <p>Here are some tips to put your mind at ease during the blood donation process</p>
      <div className="tips-container">
        <div className="tip-section">
          <h2>The day before</h2>
          <hr />
          <ul>
            <li>Have an iron-rich diet such as beans, spinach or meat, poultry.</li>
            <li>Have a proper sleep of at least 8 hours.</li>
            <li>Include more liquids in your diet</li>
          </ul>
        </div>
        <div className="tip-section">
          <h2>On the Donation day</h2>
          <hr />
          <ul>
            <li>Do carry your identify identification forms e.g. driver's license</li>
            <li>Drink 2 cups of water before donating blood</li>
            <li>Wear a half sleeve shirt so that you can easily roll it up avoid fast food before donation</li>
          </ul>
        </div>
        <div className="tip-section">
          <h2>After the Donation</h2>
          <hr />
          <ul>
            <li>Reward yourself with a snack as refreshment immediately.</li>
            <li>Drink more liquids over a period of 24 hours</li>
            <li>Remove the bandage after few hours</li>
            <li>Don't do vigorous workout & give your body rest</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tips;