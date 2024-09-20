import React, { useState } from 'react';
import axios from 'axios';
import { Spinner, Alert, Container, Form, Button, FormGroup, FormControl} from 'react-bootstrap';
import { useNavigate } from 'react-router';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const response = await axios.post('http://localhost:8080/auth/forgot-password', null, { params: { email } });
      setMessage(response.data);
      navigate('/confirm-token');
    } catch (error) {
      setError(true);
      setMessage(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="w-25 mx-auto mt-5 border border-secondary rounded" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
  <h2 className="text-center">Forgot Password</h2>
  {message && <Alert variant={error? 'danger' : 'info'}>{message}</Alert>}
  <Form onSubmit={handleSubmit} className="w-100">
    <Form.Group controlId="email" className='mt-3 mb-2'>
      <Form.Control
        type="email"
        value={email}
        onChange={handleEmailChange}
        required
        placeholder="Email address"
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
      disabled={loading}
    >
      {loading? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <span style={{ color: '#fff' }}><b>Send Reset Token</b></span>}
    </Button>
  </Form>
</Container>
  );
};

export default ForgotPassword;