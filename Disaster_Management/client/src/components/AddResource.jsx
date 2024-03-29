import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header'; 
import Footer from '../components/Footer';
import '../styles/styles.scss';

const AddResourceForm = () => {
  const [resourceType, setResourceType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null); // Define userId state variable
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve userId from the token stored in cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      const parsedToken = token.split('=')[1];
      const decodedToken = parseJwt(parsedToken); // Function to parse JWT token
      if (decodedToken && decodedToken.id) {
        setUserId(decodedToken.id);
      }
    }
  }, []);

  // Function to parse JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // Extracting disasterId from location state
  const disasterId = location.state && location.state.disasterId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'resourceType') setResourceType(value);
    if (name === 'quantity') setQuantity(value);
    if (name === 'urgency') setUrgency(value);
    if (name === 'comments') setComments(value);
  };

  const validateForm = () => {
    const errors = {};
    if (!resourceType) errors.resourceType = 'Resource Type is required';
    if (!quantity.trim()) errors.quantity = 'Quantity is required';
    if (!/^\d+$/.test(quantity)) errors.quantity = 'Quantity must be a number';
    if (!urgency) errors.urgency = 'Urgency is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5500/createResource', {
          disasterId,
          userId, 
          resourceType,
          quantity: parseInt(quantity),
          urgency,
          comments
        });
        console.log('Resource created:', response.data.resource);
        // Navigate to resource details page passing resource ID
        navigate('/resourceDetails', { state: { resourceId: response.data.resource._id } });
      } catch (error) {
        console.error('Error creating resource:', error);
      }
    }
  };


  return (
    <div>
      <Header />
      <Container className="my-5 py-4"> 
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="text-center mb-4">Add Resources</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="resourceType">
                <Form.Label>Resource Type *</Form.Label>
                <Form.Control as="select" name="resourceType" value={resourceType} onChange={handleChange} isInvalid={!!errors.resourceType}>
                  <option value="">Select resource type</option>
                  <option value="Food">Food</option>
                  <option value="First Aid Kit">First Aid Kit</option>
                  <option value="Water">Water</option>
                  <option value="Clothes">Clothes</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.resourceType}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="quantity">
                <Form.Label>Quantity *</Form.Label>
                <Form.Control type="text" name="quantity" value={quantity} onChange={handleChange} isInvalid={!!errors.quantity} />
                <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="urgency">
                <Form.Label>Urgency *</Form.Label>
                <Form.Control as="select" name="urgency" value={urgency} onChange={handleChange} isInvalid={!!errors.urgency}>
                  <option value="">Select urgency</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.urgency}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="comments">
                <Form.Label>Additional Comments</Form.Label>
                <Form.Control as="textarea" rows={8} name="comments" value={comments} onChange={handleChange} />
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default AddResourceForm;
