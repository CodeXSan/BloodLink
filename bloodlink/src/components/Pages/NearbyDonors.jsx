import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeafletMap from './LeafletMap';
import useAuth from '../../contexts/AuthContext';
import './NearbyDonors.css';

const NearbyDonors = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [donors, setDonors] = useState([]);
  const [bloodGroup, setBloodGroup] = useState('');
  const [auth] = useAuth();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      setMapLoaded(true);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        if (bloodGroup) {
          const response = await axios.get(`http://localhost:8080/donor/nearby/${bloodGroup}`, {
            params: { latitude, longitude },
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          setDonors(response.data);
        }
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    };
    fetchDonors();
  }, [latitude, longitude, bloodGroup, auth.token]);

  return (
    <div className="nearby-donors">
      <h2>Nearby Donors</h2>
      <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value)}>
        <option value="">Select a blood group</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>

      {mapLoaded ? (
        <div>
          {donors.length > 0 ? (
            <div>
              <p>Found {donors.length} {donors.length === 1 ? 'donor' : 'donors'} near you:</p>
              <LeafletMap donors={donors} requesterLocation={{ latitude, longitude }} />
            </div>
          ) : bloodGroup ? (
            <p>No donors found</p>
          ) : null}
        </div>
      ) : (
        <p>Location data not available. Please allow location access to find nearby donors.</p>
      )}
    </div>
  );
};

export default NearbyDonors;
