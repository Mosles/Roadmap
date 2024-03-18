// In Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import Roadmap from '../Roadmap/Roadmap';
import CustomDialog from './../Dialog/Dialog'; // Adjust the import path as necessary
import RoadmapDetails from '../RoadmapDetails/RoadmapDetails';
import { useRoadmap } from '../RoadmapContext/RoadmapContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const { roadmaps, fetchRoadmaps, user, addRoadmap, acknowledgeReset, initialLoading } = useRoadmap();
  const navigate = useNavigate();
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [roadmapToAcknowledge, setRoadmapToAcknowledge] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetchRoadmaps();
    }
  }, [user, navigate, fetchRoadmaps]);
  
  // New useEffect hook to set roadmapToAcknowledge
  useEffect(() => {
    const roadmapNeedingReset = roadmaps.find(roadmap => roadmap.is_reset);
    if (roadmapNeedingReset) {
      setRoadmapToAcknowledge(roadmapNeedingReset.id);
    }
  }, [roadmaps]); // Depend only on roadmaps to avoid loop
  

  const handleAddRoadmap = useCallback((newRoadmap) => {
    addRoadmap(newRoadmap);
  }, [addRoadmap]);

  const handleRoadmapSelect = useCallback((roadmap) => {
    setSelectedRoadmap(roadmap);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible(!isSidebarVisible);
  }, [isSidebarVisible]);

  const handleAcknowledgeReset = async () => {
    if (roadmapToAcknowledge) {
        await acknowledgeReset(roadmapToAcknowledge);
        // Ensure this state update is processed to close the dialog
        setRoadmapToAcknowledge(null);
        // Refetch roadmaps to update UI if necessary
        await fetchRoadmaps();
    }
};

  return (
    <div className="dashboard">
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        onAddRoadmap={handleAddRoadmap}
      />
      <div className="main-content">
        {selectedRoadmap ? (
          <>
            <button className="back-to-roadmaps" onClick={() => setSelectedRoadmap(null)}>
              <FontAwesomeIcon icon={faArrowLeft} /> Go back
            </button>
            <RoadmapDetails roadmap={selectedRoadmap} />
          </>
        ) : (
          <div className="roadmap-container">
            {roadmaps.map((roadmap) => (
              <Roadmap key={roadmap.id} roadmap={roadmap} onSelect={handleRoadmapSelect} />
            ))}
          </div>
        )}
        <CustomDialog
          isOpen={!!roadmapToAcknowledge}
          onAcknowledge={handleAcknowledgeReset}
          // onClose prop is removed
        />
      </div>
    </div>
  );
};

export default Dashboard;
