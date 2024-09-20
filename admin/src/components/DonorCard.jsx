import React, { useEffect, useState } from 'react';
import '../styles/DonorCard.css';
import useAuth from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast'
const DonorCard = ({ user }) => {
    const [profilePicture, setProfilePicture] = useState('')
    const [auth] = useAuth()
    const [eligibility, setEligibility] = useState('');

    useEffect(()=>{
        window.scrollTo(0,0);
    },[])

    useEffect(()=>{
        const fetchProfilePicture = async () => {
            if (!user.profilePicture) {
              return;
            }
            try {
              const response = await axios.get(`http://localhost:8080/donor/profile-picture/${user.profilePicture}`, {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
                responseType: 'arraybuffer',
              });
      
              if (response.status === 200) {
                const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
                const imageUrl = URL.createObjectURL(imageBlob);
                setProfilePicture(imageUrl);
              } else {
                toast.error('Failed to load profile picture');
              }
            } catch (error) {
              console.error('Error fetching profile picture:', error);
              toast.error('Error loading profile picture');
            }
          };
            fetchProfilePicture();
        }, [auth.token, user.profilePicture]);
        
        useEffect(() => {
            const checkEligibility = () => {
                if (!user.lastDonationDate) {
                    setEligibility('No donation record');
                    return;
                }
    
                const lastDonationDate = new Date(user.lastDonationDate);
                const today = new Date();
                const daysSinceLastDonation = Math.floor((today - lastDonationDate) / (1000 * 60 * 60 * 24));
    
                // Assuming donors must wait 56 days between donations
                const donationInterval = 56;
    
                if (daysSinceLastDonation >= donationInterval) {
                    setEligibility('Eligible to donate');
                } else {
                    const daysRemaining = donationInterval - daysSinceLastDonation;
                    setEligibility(`Not eligible to donate. ${daysRemaining} days remaining.`);
                }
            };
    
            checkEligibility();
        }, [user.lastDonationDate]);
    return (
        <div className="box">
        <div className="box-top">
            <img className="box-image" src={profilePicture} alt="donor" />
            <div className="title-flex">
                <h3 className="box-title">{user.firstName} {user.middleName} {user.lastName}</h3>
                <small>#{user.id}</small>
            </div>
            <div className="desc">
                <p>Email: {user.email}</p>
                <p>Phone: {user.phoneNumber}</p>
                <p>Blood Group: {user.bloodGroup}</p>
                <p>Address: {user.address}</p>
                <p>DOB: {user.dob}</p>
                <p>Last Donation Date: {user.lastDonationDate || 'N/A'}</p>
                <p>Eligibility: {eligibility}</p>
            </div>
        </div>
    </div>
    );
};

export default DonorCard;
