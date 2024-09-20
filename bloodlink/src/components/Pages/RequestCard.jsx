import React from 'react';

function RequestCard({ request, onAccept }) {
  return (
    <div className="request-card">
      <h3>{request.patientFirstName} {request.patientLastName}</h3>
      <p>Blood Type: {request.bloodGroup}</p>
      <p>Location: {request.address}</p>
      {
        request.critical? <small>Critical</small>:<></>
      }
      <button onClick={onAccept}>Accept Request</button>
    </div>
  );
}

export default RequestCard;