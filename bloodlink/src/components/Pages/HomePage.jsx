import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../HeroCarousel/HeroCarousel';
import './HomePage.css';
import Tips from '../Layout/Tips';
import Blog from './Blog';
import useAuth from '../../contexts/AuthContext';
import Requests from './Requests';

const HomePage = () => {
  const [auth] = useAuth();
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  return (
    <div className="homepage-container">
      <HeroCarousel />
      <div className="homepage-buttons">
        {!auth.user ?
        <div>
          <p>Want to save lives? <br />Sign up to become a donor today!</p>
          <Link to="/signup" className="button become-donor-button mb-2">Become a Donor</Link>
          <p className='mt-3'>Need blood urgently? <br />Request blood from our network of donors!</p>
          <Link to="/create-request" className="button request-blood-button">Request Blood</Link>
          <p>Or, see nearby donors:</p>
          <Link to="/nearby-donors" className="button">See Donors Near Me</Link>
        </div>
        :<div>
          <p className='mt-3'>Need blood urgently? <br />Request blood from our network of donors!</p>
          <Link to="/create-request" className="button request-blood-button">Request Blood</Link>
          <p className='mt-3'>Or, see nearby donors:</p>
          <Link to="/nearby-donors" className="button">See Donors Near Me</Link>
        </div>
        }
      </div>
      <Tips />
      <Blog />
      <Requests />
    </div>
  );
};

export default HomePage;