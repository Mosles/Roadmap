// In Roadmap.js
import React from 'react';
import './Roadmap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Roadmap = ({ roadmap, onSelect }) => {
  const formattedDate = roadmap.end_time
    ? new Date(roadmap.end_time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No end date set';

  const taskIndicator = roadmap.hasTasks ? (
    <span className="task-indicator">
      <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: 'red' }} />
      <span className="task-text">Tasks available</span>
    </span>
  ) : 'No tasks yet';

  return (
    <div className="roadmap-card" onClick={() => onSelect(roadmap)}>
      <div className="roadmap-header">
        <h3 className="roadmap-title">{roadmap.title}</h3>
        <span className="roadmap-type">{roadmap.type}</span>
      </div>
      <div className="roadmap-date">{formattedDate}</div>
      <div className="roadmap-description">{taskIndicator}</div>
      </div>
      );
};

export default Roadmap;