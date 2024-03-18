import React from 'react';
import { useParams } from 'react-router-dom';

const DisasterInfo = () => {
  // Use the useParams hook to extract parameter values from the URL
  const { type, location, description, dateAndTime, severityLevel } = useParams();
  console.log("type",type);

  // Log the received data for debugging
  console.log('Received Data:', { type, location, description, dateAndTime, severityLevel });

  // Handle the case when parameters are not available
  if (!type || !location || !description || !dateAndTime || !severityLevel) {
    return (
      <div>
        <h2>No Disaster Information Available</h2>
      </div>
    );
  }

  const handleEdit = () => {
    console.log('Edit disaster with type:', type);
    // Handle the edit action (navigate to edit page or show a modal)
  };

  const handleDelete = () => {
    console.log('Delete disaster with type:', type);
    // Handle the delete action
  };

  return (
    <div>
      <h2>Disaster Information</h2>

      <div>
        <h3>New Disaster Submitted:</h3>
        <table>
          <tbody>
            <tr>
              <td>Type:</td>
              <td>{type}</td>
            </tr>
            <tr>
              <td>Location:</td>
              <td>{location}</td>
            </tr>
            <tr>
              <td>Description:</td>
              <td>{description}</td>
            </tr>
            <tr>
              <td>Date and Time:</td>
              <td>{dateAndTime}</td>
            </tr>
            <tr>
              <td>Severity Level:</td>
              <td>{severityLevel}</td>
            </tr>
            {/* Add additional fields as needed */}
          </tbody>
        </table>
      </div>

      <div>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default DisasterInfo;
