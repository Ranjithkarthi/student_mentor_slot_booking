import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './PaymentPage.css';

const PaymentPage = () => {
  const [successPage, setSuccessPage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); 
  const {
    name,
    email,
    selectedDate,
    startTime,
    endTime,
    duration,
    areaOfInterest,
    price,
    mentorName,
  } = location.state || {};

  const onClickingPayNow = () => {
    setSuccessPage(true);
  };

  const onClickingHome = () => {
    navigate('/');
  };

  return (
    successPage ? (
      <div className="payment-success-overall-container">
        <div className="payment-success-card-container">
            <h3>Payment Successful</h3>
            <button type="button" onClick={onClickingHome}>Home</button>
        </div>
      </div>
    ) : (
      <div className="overall-payment-container">
        <h2>Payment Page</h2>
        <h3>Appointment Details</h3>
        <div className="payment-detail-card-container">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Area of Interest:</strong> {areaOfInterest}</p>
          <p><strong>Assigned Mentor:</strong> {mentorName}</p>
          <p><strong>Duration:</strong> {duration} minutes</p>
          <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
          <p><strong>Start Time:</strong> {new Date(startTime).toLocaleTimeString()}</p>
          <p><strong>End Time:</strong> {new Date(endTime).toLocaleTimeString()}</p>
          <p><strong>Price:</strong> Rs: {price}/-</p>
          <div className="btn-container">
            <button type="button" onClick={onClickingPayNow} className="button">Pay Now</button>
          </div>
        </div>
      </div>
    )
  );
};

export default PaymentPage;

