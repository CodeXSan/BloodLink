import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Requests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [donatedRequests, setDonatedRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const pendingResponse = await axios.get('http://localhost:8080/blood/pending');
      const acceptedResponse = await axios.get('http://localhost:8080/blood/accepted');
      const donatedResponse = await axios.get('http://localhost:8080/blood/donated');
        console.log(pendingResponse)
      setPendingRequests(pendingResponse.data);
      setAcceptedRequests(acceptedResponse.data);
      setDonatedRequests(donatedResponse.data);
    } catch (error) {
      console.error('Error fetching blood requests:', error);
    }
  };

  const renderRequests = (requests) => {
    return (
      <div>
        {requests.map(request => (
          <div key={request.id} className="request-card">
            <h3>{request.patientFirstName} {request.patientLastName}</h3>
            <p>Blood Group: {request.bloodGroup}</p>
            <p>Location: {request.address}</p>
            <p>Status: {request.status}</p>
            {/* Add more details view or modal */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="blood-requests">
      <div className="section">
        <h2>Pending Requests</h2>
        {renderRequests(pendingRequests)}
      </div>
      <div className="section">
        <h2>Accepted Requests</h2>
        {renderRequests(acceptedRequests)}
      </div>
      <div className="section">
        <h2>Donated Requests</h2>
        {renderRequests(donatedRequests)}
      </div>
    </div>
  );
};

export default Requests;
