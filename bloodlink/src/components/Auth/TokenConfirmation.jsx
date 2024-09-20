import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

const TokenConfirmation = () => {
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleConfirmToken = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/confirm-token', null, { params: { token } });
            toast.success('Token confirmed successfully.');
            navigate(`/reset-password?token=${token}`);
        } catch (error) {
            setMessage('Invalid or expired token.');
        }
    };

    return (
        <Container className="w-25 mx-auto mt-5 border border-secondary rounded" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
  <h2 className="text-center">Confirm Token</h2>
  {message && <Alert variant="info">{message}</Alert>}
  <Form onSubmit={handleConfirmToken} className="w-100">
    <Form.Group controlId="token" className='mt-3 mb-2'>
      <Form.Control
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
        placeholder="Enter your token"
      />
    </Form.Group>
    <Button
      type="submit"
      className="btn-block btn-primary mt-4"
      style={{
        backgroundColor: '#bb0a1e',
        borderColor: '#fff',
        fontSize: '15px',
        padding: '10px 20px',
        ':hover': {
          backgroundColor: '#660000',
          borderColor: '#660000',
          color: '#fff'
        }
      }}
    >
      <span style={{ color: '#fff' }}><b>Confirm Token</b></span>
    </Button>
  </Form>
</Container>
    );
};

export default TokenConfirmation;
