import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import '../styles/ResourceApproval.scss';
import Header from "../components/Header";
import Footer from "../components/Footer";

const ResourceApproval = () => {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestedResources, setRequestedResources] = useState([]);
  const [resourceStatus, setResourceStatus] = useState({});

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

  const handleApprove = async (user) => {
    setSelectedUser(user);
    await fetchRequestedResources(user._id);
    setShowModal(true);
  };

  const handleConfirmApprove = async (resourceId) => {
    try {
      const confirmApprove = window.confirm("Are you sure you want to approve this resource?");
      if (confirmApprove) {
        // Send approval email with status set to "approved"
        await axios.post('http://localhost:5500/sendApprovalEmail', {
          email: selectedUser.email,
          status: 'approved',
          userName: selectedUser.name
        });
        console.log("Approval Email sent successfully");
  
        // Set flag in DB
        await setFlagInDB(resourceId, true);
  
        // Update the resource status immediately within requestedResources
        setRequestedResources(resources =>
          resources.map(resource => {
            if (resource._id === resourceId) {
              return { ...resource, isApproved: true };
            }
            return resource;
          })
        );
      }
    } catch (error) {
      console.error('Error sending approval email:', error);
    }
  };
  
  const handleReject = async (resourceId) => {
    try {
      const confirmReject = window.confirm("Are you sure you want to reject this resource?");
      if (confirmReject) {
        // Send rejection email
        await axios.post('http://localhost:5500/sendApprovalEmail', {
          email: selectedUser.email,
          status: 'rejected',
          userName: selectedUser.name
        });
        console.log("Rejection Email sent successfully");
  
        // Set flag in DB
        await setFlagInDB(resourceId, false);
  
        // Update the resource status immediately within requestedResources
        setRequestedResources(resources =>
          resources.map(resource => {
            if (resource._id === resourceId) {
              return { ...resource, isApproved: false };
            }
            return resource;
          })
        );
      }
    } catch (error) {
      console.error('Error sending rejection email:', error);
    }
  };

  
  const setFlagInDB = async (resourceId, isApproved) => {
    try {
      await axios.put(`http://localhost:5500/setFlagInDB/${resourceId}`, {
        isApproved
      });
      console.log("Flag set in DB successfully");
    } catch (error) {
      console.error('Error setting flag in DB:', error);
    }
  };

  const fetchRequestedResources = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5500/getResourcesByUserId/${userId}`);
      const resourcesWithDisasterInfo = await Promise.all(response.data.map(async resource => {
        const disasterInfo = await fetchDisasterInfo(resource.disasterId);
        return { ...resource, disasterInfo };
      }));
      setRequestedResources(resourcesWithDisasterInfo);
    } catch (error) {
      console.error('Error fetching requested resources:', error);
      setRequestedResources([]); // Set requestedResources to empty array if no resources found
    }
  };

  const fetchDisasterInfo = async (disasterId) => {
    try {
      const response = await axios.get(`http://localhost:5500/getDisasterInfo/${disasterId}`);
      console.log('Disaster Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching disaster information:', error);
      return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div className="resource-approval">
        <Container>
          <h2 className="text-center mb-4">Resource Approval</h2>
          {userData.length > 0 ? (
            userData.map(user => (
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
            ))
          ) : (
            <div className="text-center flex-grow-1 d-flex align-items-center justify-content-center">
              <h5>No user details found</h5>
            </div>
          )}
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
          <Modal.Header closeButton className="modal-header">
           
            <Modal.Title className="modal-title">{selectedUser && selectedUser.name}'s Requested Resources</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            {requestedResources !== null && requestedResources.length > 0 ? (
              requestedResources.map(resource => (
                <div key={resource._id}>
                  <div className="disaster-info">
                    <p><strong>Disaster Type:</strong> {resource.disasterInfo?.type}</p>
                    <p><strong>Disaster Location:</strong> {resource.disasterInfo?.location}</p>
                  </div>
                  <div className="resource-info">
                    <p><strong>Resource Type:</strong> {resource.resourceType}</p>
                    <p><strong>Quantity:</strong> {resource.quantity}</p>
                    <p><strong>Urgency:</strong> {resource.urgency}</p>
                    <p><strong>Comments:</strong> {resource.comments}</p>
                  </div>
                  <div className="mt-3 text-center">
                    {resource.isApproved === true ? (
                      <Button variant="success" className="approval-button">Approved</Button>
                    ) : resource.isApproved === false ? (
                      <Button variant="danger" className="approval-button-rej">Rejected</Button>
                      ) : (
                        <>
                          <Button variant="success" className="mr-3" onClick={() => handleConfirmApprove(resource._id)}>Approve</Button>
                          <Button variant="danger" onClick={() => handleReject(resource._id)}>Reject</Button>
                        </>
                      )}
                    </div>
                    <hr className="modal-divider" />
                  </div>
                ))
              ) : (
                <div className="text-center mt-4">
                  <h5>No requested resources found</h5>
                </div>
              )}
            </Modal.Body>
          </Modal>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default ResourceApproval;
  
