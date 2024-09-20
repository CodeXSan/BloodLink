// MapPicker.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import toast from 'react-hot-toast';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const userLocationIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const nepalBounds = [[26.3479, 80.058], [30.4474, 88.2015]];

const LocationMarker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      if (isWithinBounds(lat, lng)) {
        setPosition(e.latlng);

        try {
          const response = await axios.get(`http://localhost:8080/api/geocode`, {
            params: { lat, lon: lng },
          });
          const data = response.data;

          const address = data.display_name;
          let hospitalName = '';

          if (data.address && data.address.hospital) {
            hospitalName = data.address.hospital;
          }
          localStorage.setItem('userLocation', JSON.stringify({
            latitude: lat,
            longitude: lng,
            address,
            hospitalName,
          }));

          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address,
            hospitalName,
          });
        } catch (error) {
          console.error('Error fetching address:');
        }
      } else {
        toast.error('Markers can only be placed within Nepal.');
      }
    },
  });

  const isWithinBounds = (lat, lng) => {
    const point = L.latLng(lat, lng);
    return L.latLngBounds(nepalBounds).contains(point);
  };

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon}>
      <Popup>Marked Location</Popup>
    </Marker>
  );
};

const CurrentLocationMarker = ({ center }) => {
  return (
    <Marker position={center} icon={userLocationIcon}>
      <Popup>Your Location</Popup>
    </Marker>
  );
};

const MapPicker = ({ onLocationSelect }) => {
  const [center, setCenter] = useState(null);
    const [userLocation, setUserLocation] = useState(null)
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
          localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
        },
        () => {
          setCenter([27.7172, 85.3240]);
          localStorage.removeItem('userLocation');
        },
        { enableHighAccuracy: true }
      );
    }, []);
  
    if (!center) {
      return <div>Loading...</div>;
    }

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url ="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {userLocation?
      <CurrentLocationMarker center={center} />
      : null}
      <LocationMarker onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
};

export default MapPicker;