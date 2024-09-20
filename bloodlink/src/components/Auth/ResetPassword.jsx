import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Alert, FormGroup, FormControl, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword!== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/auth/reset-password', null, {
        params: {
          token,
          newPassword: newPassword.trim()
        }
      });
      setMessage(response.data);
      toast.success("Password changed successfully")
      navigate('/login');
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  return (
    <Container className="w-25 mx-auto mt-5 border border-secondary rounded" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
      <h2 className="text-center">Reset Password</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group controlId="newPassword" className='mb-3'>
          <Form.Control
            type="password"
            value={newPassword}
            placeholder='New Password'
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Control
            type="password"
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
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
         <span style={{ color: '#fff' }}><b>Reset Password</b></span>
         </Button>
      </Form>
    </Container>
  );
};

export default ResetPassword;