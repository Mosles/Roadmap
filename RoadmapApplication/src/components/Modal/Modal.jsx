import React, { useState, useEffect } from 'react';
import './Modal.css';

const RoadmapTypeCard = ({ type, imageSrc, onSelected }) => {
  return (
    <div className="roadmap-type-card" onClick={() => onSelected(type)}>
      <img src={imageSrc} alt={type} className="card-image" />
    </div>
  );
};

const Modal = ({ isOpen, onClose, onAddSuccess }) => {
  const [title, setTitle] = useState('');
  const [endTime, setEndTime] = useState(new Date().toISOString().substring(0, 10));
  const [roadmapType, setRoadmapType] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCsrfToken = async () => {
        const response = await fetch('http://localhost:5000/csrf-token', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      };
      fetchCsrfToken();
    }
  }, [isOpen]);

  const roadmapTypes = [
    {
      type: 'Daily',
      imageSrc: 'path/to/daily-image.png', // Replace with your actual image path or URL
      description: 'Perfect for everyday tasks and routines.'
    }
  ];

  const handleSelectRoadmapType = (type) => {
    setRoadmapType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || isSubmitting || !roadmapType) return;

    setIsSubmitting(true);
    const requestBody = {
      title,
      end_time: endTime,
      type: roadmapType.toLowerCase(), // Include the roadmap type in the request
    };

    try {
      const response = await fetch('/api/auth/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const newRoadmap = await response.json();
      onAddSuccess(newRoadmap);
    } catch (error) {
      console.error('Failed to create roadmap:', error);
    } finally {
      setIsSubmitting(false);
      setTitle('');
      onClose();
    }
  };

  // Close modal if clicked on backdrop
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop-background')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-background" onClick={handleBackdropClick}>
      <div className="modal-content-roadmap">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {!roadmapType ? (
          <div className="modal-selection-container">
            <h2 className="modal-selection-title">Select Roadmap Type</h2>
            <div className="roadmap-type-container">
              {roadmapTypes.map(({ type, imageSrc }) => (
                <RoadmapTypeCard key={type} type={type} imageSrc={imageSrc} onSelected={handleSelectRoadmapType} />
              ))}
            </div>
            <p className="card-description">Perfect for everyday tasks and routines.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="roadmapTitle">Roadmap Title:</label>
            <input
              id="roadmapTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="roadmapEndTime">End Time:</label>
            <input
              id="roadmapEndTime"
              type="date"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <div className="spinner-for-all"></div> : "Create Roadmap"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Modal;
