import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DisasterForm.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DisasterForm = () => {
  const navigate = useNavigate();
  const [inputField, setInputField] = useState({
    type: '',
    location: '',
    description: '',
    dateAndTime: '',
    severityLevel: 'low',
    image: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputField({ ...inputField, [name]: value });

    // Clear validation error on input change
    setValidationErrors({ ...validationErrors, [name]: '' });

    if (name === 'type') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setValidationErrors((prevState) => ({
          ...prevState,
          [name]: 'Cannot be a number',
        }));
      } else if (value.length > 20) {
        setValidationErrors((prevState) => ({
          ...prevState,
          [name]: 'Length should not exceed 20 characters',
        }));
      }
    } else if (name === 'location') {
      if (value.length > 20) {
        setValidationErrors((prevState) => ({
          ...prevState,
          [name]: 'Length should not exceed 20 characters',
        }));
      }
    }
  };

  const uploadImage = (event) => {
    setInputField({ ...inputField, image: event.target.files[0] });
  };

  const validateForm = () => {
    const errors = {};

    if (!inputField.type) {
      errors.type = 'Type of Disaster is required';
    } else if (!/^[a-zA-Z\s]*$/.test(inputField.type)) {
      errors.type = 'Cannot be a number';
    } else if (inputField.type.length > 20) {
      errors.type = 'Length should not exceed 20 characters';
    }

    if (!inputField.location) {
      errors.location = 'Location is required';
    } else if (inputField.location.length > 20) {
      errors.location = 'Length should not exceed 20 characters';
    }

    if (!inputField.description) {
      errors.description = 'Description is required';
    } else if (inputField.description.length > 100) {
      errors.description = 'Description should not exceed 100 characters';
    }

    if (!inputField.dateAndTime) {
      errors.dateAndTime = 'Date and Time are required';
    }

    if (!inputField.image) {
      errors.image = 'Image is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (!isFormValid) {
      return; // Stop form submission if there are validation errors
    }

    try {
      const formdata = new FormData();
      formdata.append('type', inputField.type);
      formdata.append('location', inputField.location);
      formdata.append('description', inputField.description);
      formdata.append('dateAndTime', inputField.dateAndTime);
      formdata.append('severityLevel', inputField.severityLevel);

      if (inputField.image) {
        formdata.append('myFile', inputField.image, inputField.image.name);
      }

      const response = await axios.post('http://localhost:5500/submitDisaster', formdata);

      console.log('Server Response:', response.data);

      alert('Disaster submitted successfully!');
    } catch (error) {
      console.error('Error submitting disaster:', error);

      if (error.response) {
        console.error('Server Response Data:', error.response.data);
      }
    }
  };

  const handleCheckDisasters = () => {
    navigate('/disasterList');
  };

  return (
    <div>
      <Header />
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Disaster Form</h2>
        <form className="myForm" onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Type of Disaster:
            </label>
            <input
              type="text"
              className={`form-control ${validationErrors.type ? 'is-invalid' : ''}`}
              id="type"
              name="type"
              value={inputField.type}
              onChange={handleInputChange}
              required
            />
            {validationErrors.type && (
              <div className="invalid-feedback">{validationErrors.type}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location:
            </label>
            <input
              type="text"
              className={`form-control ${validationErrors.location ? 'is-invalid' : ''}`}
              id="location"
              name="location"
              value={inputField.location}
              onChange={handleInputChange}
              required
            />
            {validationErrors.location && (
              <div className="invalid-feedback">{validationErrors.location}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
              id="description"
              name="description"
              value={inputField.description}
              onChange={handleInputChange}
              required
            ></textarea>
            {validationErrors.description && (
              <div className="invalid-feedback">{validationErrors.description}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="dateAndTime" className="form-label">
              Date and Time:
            </label>
            <input
              type="datetime-local"
              className={`form-control ${validationErrors.dateAndTime ? 'is-invalid' : ''}`}
              id="dateAndTime"
              name="dateAndTime"
              value={inputField.dateAndTime}
              onChange={handleInputChange}
              required
            />
            {validationErrors.dateAndTime && (
              <div className="invalid-feedback">{validationErrors.dateAndTime}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="severityLevel" className="form-label">
              Severity Level:
            </label>
            <select
              className={`form-select ${validationErrors.severityLevel ? 'is-invalid' : ''}`}
              id="severityLevel"
              name="severityLevel"
              value={inputField.severityLevel}
              onChange={handleInputChange}
              required
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
            {validationErrors.severityLevel && (
              <div className="invalid-feedback">{validationErrors.severityLevel}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="myFile" className="form-label">
              Select Image:
            </label>
            <input
              type="file"
              accept="image/*"
              className={`form-control ${validationErrors.image ? 'is-invalid' : ''}`}
              id="myFile"
              name="myFile"
              onChange={uploadImage}
              required
            />
            {validationErrors.image && (
              <div className="invalid-feedback">{validationErrors.image}</div>
            )}
          </div>

          {inputField.image && (
            <img
              src={URL.createObjectURL(inputField.image)}
              alt="Selected"
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          )}

          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={handleCheckDisasters}
            >
              Check Disaster List
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default DisasterForm;
