import React from 'react';

function RequestDetails({ request, onDonate }) {
  return (
    <div>
      <h2>Request Details</h2>
      <p>Name:{request.patientFirstName} {request.patientLastName}</p>
      <p>Blood Type: {request.bloodType}</p>
      <p>Location: {request.location}</p>
      <p>Message: {request.message}</p>
      <button onClick={onDonate}>Donate Blood</button>
    </div>
  );
}

export default RequestDetails;