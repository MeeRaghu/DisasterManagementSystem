import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import '../styles/ResourceApproval.scss';

const ResourceApproval = () => {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestedResources, setRequestedResources] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5500/getAllUsersByResource');
        setUserData(response.data.users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchRequestedResources = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5500/getResourcesByUserId/${userId}`);
      setRequestedResources(response.data);
    } catch (error) {
      console.error('Error fetching requested resources:', error);
    }
  };

  const handleApprove = async (user) => {
    setSelectedUser(user);
    await fetchRequestedResources(user._id);
    setShowModal(true);
  };

  const handleReject = () => {
    console.log('Rejecting user with ID:', selectedUser._id);
    setShowModal(false);
  };

  const handleConfirmApprove = () => {
    console.log('Approving user with ID:', selectedUser._id);
    setShowModal(false);
  };

  return (
    <div className="resource-approval">
      <Container>
        <h2 className="text-center mb-4">User Approval</h2>
        {userData.map(user => (
          <div key={user._id}>
            <h3>User Details</h3>
            <Card className="user-card">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Username:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>City:</strong> {user.city}</p>
                    <p><strong>Postal Code:</strong> {user.postalCode}</p>
                    <p><strong>Country:</strong> {user.country}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="mt-4">
              <Button variant="success" onClick={() => handleApprove(user)}>Check Resource Requested</Button>
            </div>
          </div>
        ))}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="modal-title">Requested Resources</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          {requestedResources.map(resource => (
            <div key={resource._id}>
              <p><strong>Resource Type:</strong> {resource.resourceType}</p>
              <p><strong>Quantity:</strong> {resource.quantity}</p>
              <p><strong>Urgency:</strong> {resource.urgency}</p>
              <p><strong>Comments:</strong> {resource.comments}</p>
              <div className="mt-3 text-center">
                <Button variant="success" className="mr-3" onClick={handleConfirmApprove}>Approve</Button>
                <Button variant="danger" onClick={handleReject}>Reject</Button>
              </div>
              <hr className="modal-divider" />
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResourceApproval;
