// LoadingPage.js
import React from 'react';
import placeholderImage from '../../../notepicture.png';
import './LoadingPage.css'; // Make sure you have the correct path for your CSS file

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <img src={placeholderImage} alt="Placeholder" className="background-image" />
        <div className="spinner-for-all"></div>
      </div>
    </div>
  );
};

export default LoadingPage;
