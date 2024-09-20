import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateRequest.css';
import image from '../../assets/images/mobile-map.png';
import HowItWorks from '../Layout/HowItWorks';
import Tips from '../Layout/Tips';
import Blog from '../Pages/Blog'
const CreateRequest = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  const handleCreateRequest = () => {
    navigate('/request-blood');
  };

  return (
    <>
    <div className="create-request-container">
      <div className="content-container">
        <div><h1>Find Blood Donors</h1></div>
        <div><h1>Near You Immediately</h1></div>
        <p>Send blood requests to those near you at the click of a button!</p>
        <div className="button-container">
          <button className="create-request-button" onClick={handleCreateRequest}>CREATE REQUEST</button>
          <div><small>Fill up a simple form.</small></div>
          <div><small>Save those in need when you can!</small></div>
        </div>
      </div>
      <div className="phone-container">
        <img src={image} alt="Phone with app interface" />
      </div>
    </div>
    <HowItWorks/>
    <Tips />
    <Blog />
    </>
  );
};

export default CreateRequest;
