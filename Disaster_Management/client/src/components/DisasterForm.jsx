// src/components/DisasterForm.jsx
import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom'; // Use useNavigate for navigation
import axios from 'axios';
import '../styles/DisasterForm.scss';

const DisasterForm = () => {
    const navigate = useNavigate();
  const [inputField, setInputField] = useState({
    type: '',
    location: '',
    description: '',
    dateAndTime: '', // New field for Date and Time
    severityLevel: 'low', // Default to 'Low'
    image: '',
  });

  const handleInputChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };
  

  const uploadImage = (event) => {
    setInputField({ ...inputField, image: event.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formdata = new FormData();
      formdata.append('type', inputField.type);
      formdata.append('location', inputField.location);
      formdata.append('description', inputField.description);
      formdata.append('dateAndTime', inputField.dateAndTime);
      formdata.append('severityLevel', inputField.severityLevel);
  
      // Append the image file if it exists
      if (inputField.image) {
        formdata.append('myFile', inputField.image, inputField.image.name);
      }
  
      console.log(formdata);
      console.log('Submit Data:', inputField);
  
      const response = await axios.post('http://localhost:5500/submitDisaster', formdata);
  
      console.log('Server Response:', response.data);
  
      alert('Disaster submitted successfully!');
      
      // Extract serializable data from FormData
      const formDataObject = {};
      formdata.forEach((value, key) => {
        formDataObject[key] = value;
      });
  
      // Redirect to DisasterInfo page after successful submission
      navigate(`/disasterCard`);

      console.log(formDataObject);
    } catch (error) {
      console.error('Error submitting disaster:', error);
  
      if (error.response) {
        console.error('Server Response Data:', error.response.data);
      }
    }
  };
  

  return (
    <form className="myForm" onSubmit={handleSubmit}>
      <label>Type of Disaster:</label>
      <input type="text" name="type" onChange={handleInputChange} required />

      <label>Location:</label>
      <input type="text" name="location" onChange={handleInputChange} required />

      <label>Description:</label>
      <textarea name="description" onChange={handleInputChange} required></textarea>

      <label>Date and Time:</label>
      <input type="datetime-local" name="dateAndTime" onChange={handleInputChange} required />

      <label>Severity Level:</label>
      <select name="severityLevel" onChange={handleInputChange} required>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>

      <label>
        Select Image:
        <input
          type="file"
          accept="image/*"
          name="myFile"
          onChange={uploadImage}
        />
      </label>

      {inputField.image && (
        <img
          src={URL.createObjectURL(inputField.image)}
          alt="Selected"
          style={{ maxWidth: '100px', maxHeight: '100px' }}
        />
      )}

      <button type="submit">Submit</button>
    </form>
  );
};

export default DisasterForm;

