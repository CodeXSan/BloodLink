import React, { useEffect, useState } from 'react';
import useAuth from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';
import './Profile.css';
import toast from 'react-hot-toast';
import DonationHistory from './DonationHistory'
const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [uploading, setUploading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [donor, setDonor] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const donorId = auth.user.id;
      const response = await axios.get(`http://localhost:8080/donor/${donorId}`,{
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const profilePictureUrl = response.data.profilePicture;
      setDonor(response.data)
      if (profilePictureUrl) {
        const imageUrlResponse = await axios.get(`http://localhost:8080/donor/profile-picture/${profilePictureUrl}`,{
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          responseType: 'arraybuffer',
        });
        const imageData = imageUrlResponse.data;
        const imageBlob = new Blob([imageData], { type: 'image/jpeg' });
        const imageSrc = URL.createObjectURL(imageBlob);
        setProfilePicture(imageSrc);
      }
    };
  
    fetchProfilePicture();
  }, [auth?.user.id]);

  const handleLogout = (e) => {
    e.preventDefault();
    setAuth({
      ...auth,
      user: null,
      token: ''
    });
    localStorage.removeItem('auth');
    toast.success('Logout successfully');
    navigate('/login');
  };

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('profilePicture', file);
    
        const response = await axios.post(`http://localhost:8080/donor/updateProfilePicture/${auth.user.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (response.status === 200 && response.data ) {
          const newPhotoUrl = response.data.profilePictureUrl;
          setProfilePictureUrl(newPhotoUrl);
          toast.success('Profile photo updated successfully');
          window.location.reload();
        } else {
          toast.error('Unexpected response format');
        }
      } catch (error) {
        console.error('Error uploading photo', error);
        toast.error('Error uploading photo');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo-upload">
          <div className="profile-photo">
            <img src={profilePicture || '/default-profile.jpg'} alt="User Profile" />
          </div>
          <input
            type="file"
            id="profilePhotoInput"
            onChange={handlePhotoChange}
            disabled={uploading}
          />
          <label htmlFor="profilePhotoInput" className="upload-button">
            {uploading ? 'Uploading...' : 'Change Photo'}
          </label>
        </div>
        <h1 className="profile-name">{donor.firstName} {donor.middleName} {donor.lastName}</h1>
        <div>
          {/* <button className="edit-button" onClick={handleEditClick}>Edit Profile</button> */}
          
        </div>
      </div>
      <div className="profile-details">
        <div className="profile-detail">
          <span className="detail-label">Donor ID:</span>
          <span className="detail-value">{donor.id}</span>
        </div>
        <div className="profile-detail">
          <span className="detail-label">Phone Number:</span>
          <span className="detail-value">{donor.phoneNumber}</span>
        </div>
        <div className="profile-detail">
          <span className="detail-label">Gender:</span>
          <span className="detail-value">{donor.gender}</span>
        </div>
        <div className="profile-detail">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{donor.email}</span>
        </div>
        <div className="profile-detail">
          <span className="detail-label">Date of Birth:</span>
          <span className="detail-value">{new Date(donor.dob).toLocaleDateString()}</span>
        </div>
        <div className="profile-detail">
          <span className="detail-label">Blood Group:</span>
          <span className="detail-value">{donor.bloodGroup}</span>
        </div>
        <div className="profile-detail">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{donor.address}</span>
        </div>
      </div>
      <DonationHistory />
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
