import React, { useState, useEffect } from 'react';
import './Signup.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../../contexts/AuthContext';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [errorMessages, setErrorMessages] = useState('')
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get('http://localhost:8080/auth/user-auth', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (res.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      }
    };

    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          fetchAddress(position.coords.latitude, position.coords.longitude);
        },
        error => {
          toast.error('Please allow location access to get your current location.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  }, []);

  if (authenticated) {
    return <Navigate to="/profile/donor" />;
  }

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/geocode?lat=${lat}&lon=${lon}`);
      setAddress(response.data.display_name);
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Error fetching address.');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'middleName':
        setMiddleName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'dob':
        setDob(value);
        break;
      case 'bloodGroup':
        setBloodGroup(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'address':
        setAddress(value);
        break;
      default:
        break;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    if (password !== confirmPassword) {
      setErrorMessage(prev => (['Passwords do not match.']));
      window.scrollTo(0, 0);
      return;
    }

    const data = {
      firstName,
      middleName,
      lastName,
      gender,
      phoneNumber: phone,
      email,
      address,
      location: [longitude, latitude],
      dob,
      bloodGroup,
      password,
    };

    try {
      await axios.post('http://localhost:8080/auth/donor/register', data);
      toast.success('Registered successfully');
      navigate('/login');
    } catch (error) {
    if (error.response && error.response.data) {
      const { data } = error.response;
      if (typeof data === 'object') {
        const errors = Object.values(data);
        setErrorMessages(errors);
        window.scrollTo(0, 0);
      } else {
        toast.error('Failed to sign up.');
      }
    } else {
      toast.error('Failed to sign up.');
    }
  }
  };

  return (
    <div className="auth-containers">
      <h2>Sign Up</h2>
       {errorMessages.length > 0 && (
        <div className="alert alert-danger">
          <h6>Error:</h6>
          <ul>
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSignup}>
        <div className="form-rows">
          <div className="form-groups">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              className='form-controls'
              placeholder="First Name"
              value={firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="middleName">Middle Name:</label>
            <input
              type="text"
              id="middleName"
              className="form-controls"
              placeholder="Middle Name"
              value={middleName}
              onChange={handleChange}
            />
           </div>
          <div className="form-groups">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              className="form-controls"
              placeholder="Last Name"
              value={lastName}
              onChange={handleChange}
              required
            />
            </div>
        </div>
        <div className="form-rows">
          <div className="form-groups">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              className="form-controls"
              value={gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            </div>
          <div className="form-groups">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="text"
              id="phone"
              className="form-controls"
              placeholder="98XXXXXXXX"
              value={phone}
              onChange={handleChange}
              required
            />
             </div>
        </div>
        <div className="form-rows">
          <div className="form-groups">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="form-controls"
               placeholder="Email"
              value={email}
              onChange={handleChange}
              required
            />
             </div>
          <div className="form-groups">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              className="form-controls"
              value={dob}
              onChange={handleChange}
              required
            />
            </div>
        </div>
        <div className="form-rows">
          <div className='form-groups'>
          <label htmlFor="bloodGroup">Blood Group:</label>
          <select
            id="bloodGroup"
            className="form-controls"
             value={bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          </div>
        </div>
        <div className="form-rows">
          <div className="form-groups">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              className="form-controls"
              placeholder="Address"
              value={address}
              onChange={handleChange}
              required
              readOnly
            />
            </div>
        </div>
        <div className="form-rows">
          <div className="form-groups">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="form-controls"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
            />
           </div>
          <div className="form-groups">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-controls"
               placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
            </div>
        </div>
        <button type="submit" className="btns btn-primarys">Sign Up</button>
      </form>
      <p className="text-centers">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
