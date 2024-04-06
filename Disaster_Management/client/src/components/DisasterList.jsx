import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPencil, BsTrash } from 'react-icons/bs';
import '../styles/DisasterForm.scss'; 
import Header from '../components/Header';
import Footer from '../components/Footer';

const DisasterList = () => {
  const [disasters, setDisasters] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationNeeded, setPaginationNeeded] = useState(false);

  const recordsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5500/getDisasters');
        setDisasters(response.data.reverse());
        if (response.data.length > recordsPerPage) {
          setPaginationNeeded(true);
        }
      } catch (error) {
        console.error('Error fetching disasters:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (id) => {
    const editedDisaster = disasters.find((disaster) => disaster._id === id);
  
    const formattedDateForInput = formatDateForInput(editedDisaster.dateAndTime);
  
    setEditingId(id);
    setEditedData({
      ...editedDisaster,
      dateAndTime: formattedDateForInput,
    });
    setShowConfirmation(false); 
  };

  const handleSave = async (id) => {
    console.log('Saving disaster with ID:', id);
    
    try {
      const formData = new FormData();
      if (!editedData.type || !editedData.location || !editedData.description || !editedData.dateAndTime || !editedData.severityLevel) {
        alert('All fields are required!');
        return;
      }
      formData.append('type', editedData.type);
      formData.append('location', editedData.location);
      formData.append('description', editedData.description);
      formData.append('dateAndTime', editedData.dateAndTime);
      formData.append('severityLevel', editedData.severityLevel);

      if (editedData.image) {
        formData.append('image', editedData.image);
      }

      if (editingId) {
        await axios.put(`http://localhost:5500/editDisaster/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:5500/submitDisaster', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setEditingId(null);
      setEditedData({});
      setShowConfirmation(false);
      const response = await axios.get('http://localhost:5500/getDisasters');
      setDisasters(response.data.reverse());
      console.log('API Response:', response.data); 
    } catch (error) {
      console.error('Error saving disaster:', error);
    }
  };

  const formatDateForInput = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this disaster?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5500/deleteDisaster/${id}`);
        const updatedDisasters = disasters.filter((disaster) => disaster._id !== id);
        setDisasters(updatedDisasters);
      } catch (error) {
        console.error('Error deleting disaster:', error);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    handleInputChange('image', imageFile);
    e.target.value = '';
  };

  const toggleConfirmation = () => {
    setShowConfirmation((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedData({});
    setShowConfirmation(false);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Manage Disaster List</h2>
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Type</th>
              <th>Location</th>
              <th>Description</th>
              <th>Date and Time</th>
              <th>Severity Level</th>
              <th>Image</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disasters.slice(startIndex, endIndex).map((disaster) => (
              <tr key={disaster._id}>
                <td>
                  {editingId === disaster._id ? (
                    <input
                      type="text"
                      name="type"
                      value={editedData.type || ''}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="edit-input" 
                    />
                  ) : (
                    disaster.type
                  )}
                </td>
                <td>
                  {editingId === disaster._id ? (
                    <input
                      type="text"
                      name="location"
                      value={editedData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="edit-input" 
                    />
                  ) : (
                    disaster.location
                  )}
                </td>
                <td className="custom-grid-column">
                  {editingId === disaster._id ? (
                    <textarea
                      name="description"
                      value={editedData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      style={{ height: '100px', overflowY: 'auto' }}
                      className="edit-input" 
                    />
                  ) : (
                    <div className="textarea-wrap">{disaster.description}</div>
                  )}
                </td>
                <td>
                  {editingId === disaster._id ? (
                    <input
                      type="datetime-local"
                      name="dateAndTime"
                      value={editedData.dateAndTime || formatDateForInput(disaster.dateAndTime)}
                      onChange={(e) => handleInputChange('dateAndTime', e.target.value)}
                      className="custom-datetime-input mt-2 edit-input"
                    />
                  ) : (
                    <div onClick={() => handleEdit(disaster._id)}>
                      {formatDate(disaster.dateAndTime)}
                    </div>
                  )}
                </td>
                <td>
                  {editingId === disaster._id ? (
                    <select
                      value={editedData.severityLevel || ''}
                      onChange={(e) => handleInputChange('severityLevel', e.target.value)}
                      className="edit-input" 
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  ) : (
                    disaster.severityLevel
                  )}
                </td>
                <td>
                  {editingId === disaster._id ? (
                    <>
                      <div className="image-upload-container">
                        <label className="custom-file-input">
                          Choose a different Image:
                          <input
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={handleImageChange}
                            className="edit-input" 
                          />
                        </label>
                      </div>
                      {editedData.image ? (
                        <img
                          src={editedData.image instanceof File ? URL.createObjectURL(editedData.image) : `http://localhost:5500/assets/${editedData.image}`}
                          alt="Selected"
                          style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                      ) : (
                        <img
                          src={`http://localhost:5500/assets/${disaster.image}`}
                          alt="Existing"
                          style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                      )}
                      {editedData.image && <p>{editedData.image.name}</p>}
                    </>
                  ) : (
                    <img
                      src={`http://localhost:5500/assets/${disaster.image}`}
                      alt={disaster.type}
                      className="img-fluid"
                    />
                  )}
                </td>
                <td className="text-center">
                  <div className="btn-group">
                    {editingId === disaster._id ? (
                      <>
                        <button className="btn btn-outline-success me-md-2" onClick={toggleConfirmation}>
                          Save
                        </button>
                        <button
                          className="btn btn-outline-secondary me-md-2"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-outline-primary me-md-2" onClick={() => handleEdit(disaster._id)}>
                        <BsPencil /> Edit
                      </button>
                    )}
                    <button
                      className="btn btn-outline-danger btn-sm ms-md-2"
                      onClick={() => handleDelete(disaster._id)}
                    >
                      <BsTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginationNeeded && (
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: Math.ceil(disasters.length / recordsPerPage) }, (_, index) => index + 1).map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(pageNumber)}>
                    {pageNumber}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <Footer />
      {showConfirmation && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Save Changes</h5>
                <button type="button" className="btn-close" onClick={toggleConfirmation}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to save changes?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={toggleConfirmation}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => handleSave(editingId)}>Confirm Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterList;
