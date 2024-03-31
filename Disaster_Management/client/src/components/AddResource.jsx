import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
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
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      const parsedToken = token.split('=')[1];
      const decodedToken = parseJwt(parsedToken);
      if (decodedToken && decodedToken.id) {
        setUserId(decodedToken.id);
      }
    }
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

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
    const isFormValid = validateForm(); // Validate the form
    if (isFormValid) {
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
        navigate('/resourceDetails', { state: { resourceId: response.data.resource._id } });
      } catch (error) {
        console.error('Error creating resource:', error);
      }
    }
  };
  

  const handleNavigateToDisasterCard = () => {
    navigate('/disastercard');
  };

  return (
    <div className="wrapper-res">
      <Header />
      <div className="content-res">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <form onSubmit={handleSubmit} className="p-4 rounded add-res-container orange-form">
                <h2 className="text-center">Add Resources</h2>
                <div className="form-group">
                  <label>Resource Type *</label>
                  <select className={`form-control ${errors.resourceType ? 'is-invalid' : ''}`} name="resourceType" value={resourceType} onChange={handleChange}>
                    <option value="">Select resource type</option>
                    <option value="Food">Food</option>
                    <option value="First Aid Kit">First Aid Kit</option>
                    <option value="Water">Water</option>
                    <option value="Clothes">Clothes</option>
                  </select>
                  {errors.resourceType && <div className="invalid-feedback">{errors.resourceType}</div>}
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input type="text" className={`form-control ${errors.quantity ? 'is-invalid' : ''}`} name="quantity" value={quantity} onChange={handleChange} />
                  {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                </div>

                <div className="form-group">
                  <label>Urgency *</label>
                  <select className={`form-control ${errors.urgency ? 'is-invalid' : ''}`} name="urgency" value={urgency} onChange={handleChange}>
                    <option value="">Select urgency</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  {errors.urgency && <div className="invalid-feedback">{errors.urgency}</div>}
                </div>

                <div className="form-group">
                  <label>Additional Comments</label>
                  <textarea className="form-control" rows={4} name="comments" value={comments} onChange={handleChange} />
                </div>

                <div className="text-center">
                  <Button className="btn-good-color" type="submit">
                    Submit
                  </Button>
                  <span className="ml-4"></span> {/* Add more margin */}
                  <Button className="btn-primary" onClick={handleNavigateToDisasterCard}>
                    Go to Disaster Card
                  </Button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddResourceForm;
