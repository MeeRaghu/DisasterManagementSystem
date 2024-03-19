import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResourceDetail = () => {
  const [resources] = useState([
    {
      type: 'Food',
      description: 'Canned food, non-perishable',
      availability: 'Available',
      quantity: 100
    },
    {
      type: 'Water',
      description: 'Bottled water, purified',
      availability: 'Out of stock',
      quantity: 0
    },
    {
      type: 'Medical Supplies',
      description: 'First aid kits, bandages',
      availability: 'Available',
      quantity: 50
    }
    // Add more items here
  ]);

  const handleEdit = () => {
    // Handle edit action
    console.log('Edit button clicked');
  };

  const handleDelete = () => {
    // Handle delete action
    console.log('Delete button clicked');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Resource Detail</h2>
      <div className="row">
        {resources.map((resource, index) => (
          <div key={index} className="col-md-6">
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">{resource.type}</h5>
                <p className="card-text"><strong>Description:</strong> {resource.description}</p>
                <p className="card-text"><strong>Availability:</strong> {resource.availability}</p>
                <p className="card-text"><strong>Quantity:</strong> {resource.quantity}</p>
                <button className="btn btn-primary mr-2" onClick={handleEdit}>Edit</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceDetail;
