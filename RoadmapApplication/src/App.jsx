import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import LoadingPage from './components/LoadingPage/LoadingPage';
import Dashboard from './components/Dashboard/Dashboard';
import { RoadmapProvider, useRoadmap } from './components/RoadmapContext/RoadmapContext';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const AppContent = () => {
  const { loading } = useRoadmap(); // Assuming loading state is part of your context
  
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      // No explicit route for LoadingPage; it's conditionally rendered
    </Routes>
  );
};

const App = () => {
  return (
    <RoadmapProvider>
      <Router>
        <AppContent />
      </Router>
    </RoadmapProvider>
  );
};

export default App;
