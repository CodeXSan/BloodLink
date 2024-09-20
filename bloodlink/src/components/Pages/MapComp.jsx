import React,{useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import smile from '../../assets/images/smileblod.png'
import sad from '../../assets/images/sadblood.png'
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const bloodIcon = L.icon({
  iconUrl: sad,
  iconSize: [40, 60],
  iconAnchor: [20, 60],
});

const requesterIcon = L.icon({
  iconUrl: smile,
  iconSize: [40, 60],
  iconAnchor: [20, 60],
});

const MapComp = ({ donorLocation, receiverLocation }) => {
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    calculateDirections();
  }, []);

  const calculateDirections = async () => {
    const origin = donorLocation;
    const destination = receiverLocation;
    const apiEndpoint = 'https://api.openrouteservice.org/v2/directions';
    const params = {
      api_key: '5b3ce3597851110001cf6248392e507dc5464e7bbcb29a654de4931b',
      coordinates: `${origin},${destination}`,
      profile: 'driving-car',
      format: 'geojson',
    };

    try {
      const response = await axios.get(apiEndpoint, { params });
      const directionsData = response.data.features[0].geometry.coordinates;
      setDirections(directionsData);
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <MapContainer
      center={donorLocation}
      zoom={12}
      style={{ height: '250px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={donorLocation}
        icon={requesterIcon}
      >
        <Popup>
          <div>
            <h3>Donor Location</h3>
          </div>
        </Popup>
      </Marker>
      <Marker
        position={receiverLocation}
        icon={bloodIcon}
      >
        <Popup>
          <div>
            <h3>Receiver Location</h3>
          </div>
        </Popup>
      </Marker>
      <Polyline
        positions={directions}
        color="blue"
        weight={3}
      />
    </MapContainer>
  );
};

export default MapComp;