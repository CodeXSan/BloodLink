import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapPicker from './MapPicker';
import '../styles/RequestBlood.css';
import toast from 'react-hot-toast';
import useAuth from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';

const RequestBlood = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientFirstName: '',
    patientLastName: '',
    attendeeFirstName: '',
    attendeeLastName: '',
    phoneNumber: '',
    dob: '',
    address: '',
    location: [],
    bloodGroup: '',
    quantity: '',
    note: '',
    requiredDate: '',
    critical: false,
  });
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }

  const currentDate = `${year}-${month}-${day}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  useEffect(() => {
    if (auth.user) {
      setFormData(prevState => ({
        ...prevState,
        attendeeFirstName: auth.user.firstName,
        attendeeLastName: auth.user.lastName,
        phoneNumber: auth.user.phoneNumber,
      }));
    }
  }, [auth.user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangePhoneNumber = (event) => {
    setFormData({...formData, phoneNumber: event.target.value });
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      location: [location.longitude, location.latitude],
      address: location.address,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    axios.post('http://localhost:8080/blood/request', formData)
      .then(response => {
        console.log('Data sent successfully:', response.data);
        toast.success("Request Submitted successfully");
        localStorage.removeItem('userLocation');
        navigate("/")
      })
      .catch(error => {
        console.error('Error sending data:', error);
        toast.error("Error sending request");
      });
  };

  return (
    <div className="request-blood-container">
      <div className="form-containerl">
        <h1>Request for Blood </h1>
        <form className="form-requestl" onSubmit={handleSubmit}>
          <div className='form-fieldsl'>
          <div className="form-groupl">
            <label className="label-namel" htmlFor="patientFirstName">Patient First Name <span className="required">*</span></label>
            <input
            className=''
              type="text"
              id="patientFirstName"
              name="patientFirstName"
              value={formData.patientFirstName}
              onChange={handleChange}
              required
              pattern="^[a-zA-Z]+$"
              title="Name must contain only letters"
            />
          </div>
          <div className="form-groupl">
            <label className="label-namel" htmlFor="patientLastName">Patient Last Name <span className="required">*</span></label>
            <input
              type="text"
              id="patientLastName"
              name="patientLastName"
              value={formData.patientLastName}
              onChange={handleChange}
              required
              pattern="^[a-zA-Z]+$"
              title="Name must contain only letters"
            />
          </div>
          <div className="form-groupl">
            <label className="label-namel"htmlFor="attendeeFirstName">Attendee First Name <span className="required">*</span></label>
            <input
              type="text"
              id="attendeeFirstName"
              name="attendeeFirstName"
              value={formData.attendeeFirstName}
              onChange={handleChange}
              required
              pattern="^[a-zA-Z]+$"
              title="Name must contain only letters"
            />
          </div>
          <div className="form-groupl">
            <label className="label-namel" htmlFor="attendeeLastName">Attendee Last Name <span className="required">*</span></label>
            <input
              type="text"
              id="attendeeLastName"
              name="attendeeLastName"
              value={formData.attendeeLastName}
              onChange={handleChange}
              required
              pattern="^[a-zA-Z]+$"
              title="Name must contain only letters"
            />
          </div>
          <div className="form-groupl">
            <label className="label-namel" htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChangePhoneNumber}
              required
              className="phone-input"
            />
          </div>
          <div className="form-groupl">
            <label className="label-namel" htmlFor="dob">Date of Birth <span className="required">*</span></label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupl">
            <label className="label-namel" htmlFor="address">Address <span className="required">*</span></label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          <div  className="form-groupl">
            <label className="label-namel"htmlFor="bloodGroup">Blood Group <span className="required">*</span></label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
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
          <div className="form-groupl">
            <label className="label-namel" htmlFor="quantity">Quantity <span className="required">*</span></label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              step="1"
            />
          </div>
          <div className="form-groupl" >
            <label className="label-namel" htmlFor="requiredDate">Required Date <span className="required">*</span></label>
            <input
              type="date"
              id="requiredDate"
              name="requiredDate"
              min={currentDate}
              value={formData.requiredDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupl full-widthl">
            <label className="label-namel" htmlFor="note">Note</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </div>
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="critical"
          name="critical"
          checked={formData.critical}
          onChange={(e) => setFormData({ ...formData, critical: e.target.checked })}
        />
        <span>It is critical and emergency</span>
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          name="agreeTerms"
          required
        />
        <span>I have read and agree to the Terms & Service and Privacy Policy</span>
      </div>
      <div className="submit-btn">
        <button type="submit">Submit Your Request</button>
      </div>
    </form>
      </div >
  <div className="map-container">
    <MapPicker onLocationSelect={handleLocationSelect} />
  </div>
    </div >
  );
};

export default RequestBlood;