import React, { useState, useEffect } from 'react';
import useAuth from '../../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './EditProfile.css';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const donorId = auth?.user.id;
        const response = await axios.get(`http://localhost:8080/donor/${donorId}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setFirstName(response.data.firstName);
        setMiddleName(response.data.middleName);
        setLastName(response.data.lastName);
        setPhoneNumber(response.data.phoneNumber);
        setEmail(response.data.email);
        setAddress(response.data.address);
        setLatitude(response.data.location[1]);
        setLongitude(response.data.location[0]);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching profile picture');
      }
    };
    fetchProfilePicture();
  }, [auth?.user.id]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          fetchAddress(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          toast.error('Please allow location access to submit your request.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      setAddress(response.data.display_name);
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Error fetching address.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedUser = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      location: [longitude, latitude],
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/donorr/updateProfile`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const updatedAuthUser = {
          ...auth,
          user: response.data,
          token: response.data.token
        };
        setAuth(updatedAuthUser);
        navigate('/profile');
        toast.success('Profile updated successfully');
      } else {
        toast.error('Error updating profile');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error('Error updating profile');
      }
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Middle Name</label>
          <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required readOnly />
        </div>
        <button type="submit" className="save-button">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;
