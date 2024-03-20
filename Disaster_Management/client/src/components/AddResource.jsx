import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AddResourceForm = () => {
  const [resourceType, setResourceType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'resourceType') setResourceType(value);
    if (name === 'quantity') setQuantity(value);
    if (name === 'urgency') setUrgency(value);
    if (name === 'comments') setComments(value);
  };

  const validateForm = () => {
    const errors = {};
    if (!resourceType.trim()) errors.resourceType = 'Resource Type is required';
    if (!quantity.trim()) errors.quantity = 'Quantity is required';
    if (!/^\d+$/.test(quantity)) errors.quantity = 'Quantity must be a number';
    if (!urgency) errors.urgency = 'Urgency is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', { resourceType, quantity, urgency, comments });
      // You can add your logic to submit the form data to the backend here
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mb-4">Add Resources</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="resourceType">
              <Form.Label>Resource Type *</Form.Label>
              <Form.Control type="text" name="resourceType" value={resourceType} onChange={handleChange} isInvalid={!!errors.resourceType} />
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
              <Form.Control as="textarea" rows={3} name="comments" value={comments} onChange={handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddResourceForm;
