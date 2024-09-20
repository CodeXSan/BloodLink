import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DonatePage.css';
import useAuth from '../../contexts/AuthContext';
import { IoShareSocialSharp } from 'react-icons/io5';
import { FaArrowDown, FaGreaterThan } from 'react-icons/fa';
import MapComp from './MapComp';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

function DonatePage() {
  const [auth] = useAuth();
  const [receivers, setReceivers] = useState([]);
  const [showSameBloodType, setShowSameBloodType] = useState(true);
  const [showMap, setShowMap] = useState({});
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation([latitude, longitude]);
          },
          (error) => {
            console.error('Error getting current location:', error);
            setCurrentLocation(auth.user.location);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        // Geolocation not supported, fallback to auth.user.location
        setCurrentLocation(auth.user.location);
      }
    };

    fetchCurrentLocation();
  }, [auth.user.location]);

  useEffect(() => {
    const urls = ['http://localhost:8080/blood/pending', 'http://localhost:8080/blood/accepted'];

    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          urls.map(url => axios.get(url, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }))
        );
        const allData = responses.flatMap(response => response.data);
        setReceivers(allData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [auth.token]);

  const handleToggle = (showSame) => {
    setShowSameBloodType(showSame);
  };

  const handleAccept = async (receiverId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/blood/accept/${receiverId}?donorId=${auth.user.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.status === 200) {
        setReceivers(prevReceivers =>
          prevReceivers.map(receiver =>
            receiver.id === receiverId ? { ...receiver, status: 'Accepted', phoneNumber: response.data.phoneNumber } : receiver
          )
        );
        window.location.reload()
        
      } else {
        toast.error(`${response.data || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error(`${error.response?.data || error.message}`);
    }
  };

  const handleShowMap = (receiver) => {
    setSelectedReceiver(receiver);
    setShowMap(prevState => ({
      ...prevState,
      [receiver.id]: !prevState[receiver.id]
    }));
  };

  const handleDonate = async (requestId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/blood/mark-donated/${requestId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.status === 200) {
        setReceivers(prevReceivers =>
          prevReceivers.map(receiver =>
            receiver.id === requestId ? { ...receiver, status: 'Donated' } : receiver
          )
        );
        navigate('/');
        toast.success('Thank you for donation!');
      } else {
        toast.error(`${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error(`${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/blood/cancel/${requestId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
  
      if (response.status === 200) {
        setReceivers(prevReceivers =>
          prevReceivers.map(receiver =>
            receiver.id === requestId ? { ...receiver, status: 'Pending', acceptedBy: null, phoneNumber: null } : receiver
          )
        );
        toast.success('Request canceled successfully!');
      } else {
        toast.error(`Error canceling request: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error(`Error canceling request: ${error.response?.data?.message || error.message}`);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortAndFilterReceivers = () => {
    if (!currentLocation) return [];

    return receivers
      .map(receiver => ({
        ...receiver,
        distance: calculateDistance(
          currentLocation[0], currentLocation[1],
          receiver.location[1], receiver.location[0]
        )
      }))
      .sort((a, b) => {
        if (a.status === 'Accepted' && b.status !== 'Accepted') return -1;
        if (a.status !== 'Accepted' && b.status === 'Accepted') return 1;
        return a.distance - b.distance;
      });
  };

  const sameBloodGroupReceivers = sortAndFilterReceivers().filter(
    receiver => receiver.bloodGroup === auth.user.bloodGroup
  );

  const otherBloodGroupReceivers = sortAndFilterReceivers().filter(
    receiver => receiver.bloodGroup !== auth.user.bloodGroup
  );

  const renderReceiverCard = (receiver) => {
    const isRequiredDateTodayOrFuture = new Date(receiver.requiredDate) >= new Date();
    return (
      <div key={receiver.id} className="request-card">
        <div className="request-info">
          <h2>{receiver.patientFirstName} {receiver.patientLastName}</h2>
          <h5>{receiver.bloodGroup} {receiver.quantity} units</h5>
          <h5>{receiver.address}</h5>
          <h5>Required by: {receiver.requiredDate}</h5>
          {currentLocation && (
            <h5>Distance: {receiver.distance?.toFixed(2)} km</h5>
          )}
          {receiver.critical && <p className='fw-bold color text-danger'>Critical</p>}
          {auth.user.id === receiver.acceptedBy?.id && receiver.phoneNumber && (
            <h5>Phone Number: {receiver.phoneNumber}</h5>
          )}
        </div>
        <div className="request-actions">
          <button className="share-btn"><IoShareSocialSharp /></button>
          {receiver.status === 'Pending' ? (
            <button className="accept-btn" onClick={() => handleAccept(receiver.id)}>Accept</button>
          ) : receiver.status === 'Accepted' && isRequiredDateTodayOrFuture ? (
            <>
              <button className="donate-btn" onClick={() => handleDonate(receiver.id)}>Donated</button>
              <button className="cancel-btn" onClick={() => handleCancel(receiver.id)}>Cancel</button>
            </>
          ) : (
            <p style={{ color: 'green' }}>Accepted</p>
          )}
          <button className="arrow-btn" onClick={() => handleShowMap(receiver)}>
            {showMap[receiver.id] ? <FaArrowDown /> : <FaGreaterThan />}
          </button>
        </div>
        {showMap[receiver.id] && (
          <MapComp
            donorLocation={currentLocation}
            receiverLocation={[receiver.location[1], receiver.location[0]]}
          />
        )}
      </div>
    );
  };

  return (
    <div className="blood-donation">
      <h1>Donate Blood</h1>
      <div className="blood-type-toggle">
        <button
          className={showSameBloodType ? 'active' : ''}
          onClick={() => handleToggle(true)}
        >
          Same Blood Type
        </button>
        <button
          className={!showSameBloodType ? 'active' : ''}
          onClick={() => handleToggle(false)}
        >
          Other Blood Types
        </button>
      </div>
      <div className="request-list">
        {(showSameBloodType ? sameBloodGroupReceivers : otherBloodGroupReceivers).map(renderReceiverCard)}
      </div>
    </div>
  );
}

export default DonatePage;
