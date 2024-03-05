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
    <div className="container mt-5">
    <h2 className="text-center mb-4">Disaster Form</h2>
      <form className="myForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Type of Disaster:
          </label>
          <input
            type="text"
            className="form-control"
            id="type"
            name="type"
            value={inputField.type}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location:
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            name="location"
            value={inputField.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={inputField.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="dateAndTime" className="form-label">
            Date and Time:
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="dateAndTime"
            name="dateAndTime"
            value={inputField.dateAndTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="severityLevel" className="form-label">
            Severity Level:
          </label>
          <select
            className="form-select"
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
        </div>

        <div className="mb-3">
          <label htmlFor="myFile" className="form-label">
            Select Image:
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="myFile"
            name="myFile"
            onChange={uploadImage}
          />
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
          <button type="button" className="btn btn-secondary ms-2" onClick={handleCheckDisasters}>
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
