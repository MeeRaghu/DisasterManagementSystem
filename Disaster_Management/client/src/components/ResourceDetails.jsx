import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ResourceCardList = () => {
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    resourceType: "",
    quantity: "",
    urgency: "",
    comments: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const resourceId = location.state && location.state.resourceId;
  const userDetail = JSON.parse(localStorage.getItem("user"));
  const isAdmin = userDetail.isAdmin;

  useEffect(() => {
    const fetchResourceByUserId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5500/resources/${userDetail._id}`
        );
        setResources(response.data);
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    };

    fetchResourceByUserId();
  }, [userDetail._id]);

  const handleEdit = (id, data) => {
    setEditingId(id);
    setEditedData(data);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(
        `http://localhost:5500/resources/update/${id}`,
        editedData
      );
      const updatedResources = resources.map((resource) =>
        resource._id === id ? { ...resource, ...editedData } : resource
      );
      setResources(updatedResources);
      setEditingId(null);
      console.log("Resource updated successfully");
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await axios.delete(`http://localhost:5500/resources/delete/${id}`);
        // Filter out the deleted resource from the state
        setResources(resources.filter((resource) => resource._id !== id));
        console.log("Resource deleted successfully");
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="container mt-5 flex-grow-1">
        <div
          className="disaster-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="text-center mb-4">Resource Details</h2>
          {!isAdmin && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-md btn-primary"
            >
              Back
            </button>
          )}
        </div>

        {resources.length > 0 ? (
          <div className="row">
            {resources.map((resource) => (
              <div className="col-md-4 mb-4" key={resource._id}>
                <div className="card">
                  <div className="card-body">
                    {editingId === resource._id ? (
                      <>
                        <input
                          type="text"
                          name="resourceType"
                          value={editedData.resourceType}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                          placeholder="Resource Type"
                        />
                        <input
                          type="text"
                          name="quantity"
                          value={editedData.quantity}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                          placeholder="Quantity"
                        />
                        <input
                          type="text"
                          name="urgency"
                          value={editedData.urgency}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                          placeholder="Urgency"
                        />
                        <input
                          type="text"
                          name="comments"
                          value={editedData.comments}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                          placeholder="Comments"
                        />
                        <button
                          className="btn btn-success mr-2"
                          onClick={() => handleSave(resource._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <h5 className="card-title">{resource.resourceType}</h5>
                        <p className="card-text">
                          <strong>Quantity:</strong> {resource.quantity}
                        </p>
                        <p className="card-text">
                          <strong>Urgency:</strong> {resource.urgency}
                        </p>
                        <p className="card-text">
                          <strong>Comments:</strong> {resource.comments}
                        </p>
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEdit(resource._id, resource)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(resource._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center flex-grow-1 d-flex align-items-center justify-content-center">
            <h5>No resources found</h5>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ResourceCardList;
