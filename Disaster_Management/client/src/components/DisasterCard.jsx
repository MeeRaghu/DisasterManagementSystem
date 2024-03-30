import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/DisasterCard.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DisasterCard = () => {
  const [disasters, setDisasters] = useState([]);
  const navigate = useNavigate();
  const userDetail = JSON.parse(localStorage.getItem("user"));
  const isAdmin = userDetail.isAdmin;

  useEffect(() => {
    const fetchAndSortDisasters = async () => {
      try {
        const response = await axios.get("http://localhost:5500/getDisasters");
        const sortedDisasters = response.data.sort(
          (a, b) => new Date(b.dateAndTime) - new Date(a.dateAndTime)
        );
        setDisasters(sortedDisasters);
      } catch (error) {
        console.error("Error fetching and sorting disasters:", error);

        if (error.response) {
          console.error("Server Response Data:", error.response.data);
        }
      }
    };

    fetchAndSortDisasters();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString("en-US", options);
  };

  const handleAddResourceClick = (disasterId) => {
    navigate("/addResource", { state: { disasterId } });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const routeResourceDetails = () => {
    navigate("/resourceDetails");
  };

  return (
    <div>
      {disasters.length === 0 && <Footer />}
      <Header />
      <div className="disaster-container">
        <div
          className="disaster-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontWeight: "bold" }}>Disaster Cards</h2>
          {!isAdmin && (
            <button
              type="button"
              onClick={routeResourceDetails}
              className="btn btn-md btn-primary"
            >
              Resource Details
            </button>
          )}
        </div>
        {disasters.length > 0 && (
          <Slider {...settings}>
            {disasters.map((disaster) => (
              <div key={disaster._id} className="disaster-card">
                <button
                  onClick={() => handleAddResourceClick(disaster._id)}
                  className="add-resource-button"
                >
                  Add Resource
                </button>
                <div className="card-content">
                  <p>
                    <strong>{disaster.type}</strong>
                  </p>
                  <p>
                    <strong>Location:</strong> {disaster.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {disaster.description}
                  </p>
                  <p>
                    <strong>Date and Time:</strong>{" "}
                    {formatDateTime(disaster.dateAndTime)}
                  </p>
                  <p>
                    <strong>Severity Level:</strong> {disaster.severityLevel}
                  </p>
                </div>
                {disaster.image && (
                  <img
                    src={`http://localhost:5500/assets/${disaster.image}`}
                    alt="Disaster"
                    className="card-image"
                  />
                )}
                <hr />
              </div>
            ))}
          </Slider>
        )}
        {disasters.length === 0 && (
          <div className="text-center">
            <h5>No disasters found</h5>
          </div>
        )}
      </div>
      {disasters.length > 0 && <Footer />}
    </div>
  );
};

export default DisasterCard;
