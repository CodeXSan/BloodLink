import React, { useState, useEffect } from 'react';
import useAuth from '../contexts/AuthContext';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';

const Home = () => {
    const [auth] = useAuth();
    const [newDonors, setNewDonors] = useState(0);
    const [newRequests, setNewRequests] = useState(0);

    useEffect(() => {
      const fetchNewRequests = async () => {
          try {
              const response = await axios.get('http://localhost:8080/admin/newrequests', {
                  headers: {
                      Authorization: `Bearer ${auth.token}`,
                  },
              });
              setNewRequests(response.data.count);
          } catch (error) {
              console.error('Error fetching new requests:', error.response ? error.response.data : error.message);
          }
      };

      const fetchNewDonors = async () => {
          try {
              const response = await axios.get('http://localhost:8080/admin/newdonors', {
                  headers: {
                      Authorization: `Bearer ${auth.token}`,
                  },
              });
              setNewDonors(response.data.count);
          } catch (error) {
              console.error('Error fetching new donors:', error.response ? error.response.data : error.message);
          }
      };

      fetchNewRequests();
      fetchNewDonors();
  }, []);

    return (
            <Container className="mt-4">
                <header className="mb-4">
                    <h1 className="display-4 fw-bold">BloodLink Admin Dashboard</h1>
                    <p className="lead fw-bold">Welcome, Admin!</p>
                </header>

                <Row>
                    <Col md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Header as="h5">New Donor Registrations</Card.Header>
                            <Card.Body>
                                <Card.Title>{newDonors}</Card.Title>
                                <Card.Text>
                                    New donors registered today.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Header as="h5">New Requests</Card.Header>
                            <Card.Body>
                                <Card.Title>{newRequests}</Card.Title>
                                <Card.Text>
                                    Blood requests made today.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
    );
};

export default Home;
