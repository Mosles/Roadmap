import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCog, faArrowLeft, faRightFromBracket, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import Modal from '../Modal/Modal';
import { useRoadmap } from '../RoadmapContext/RoadmapContext';

const Sidebar = ({ isSidebarVisible, toggleSidebar, onAddRoadmap }) => {
  const { user, logoutUser } = useRoadmap();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 750);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleAddRoadmapClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  // Define toggleDropdown function
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  // Define closeDropdown function
  const closeDropdown = () => setIsDropdownVisible(false);
  // This function will be passed to the Modal component as a prop to handle the successful addition of a roadmap
  const handleAddSuccess = (newRoadmap) => {
    onAddRoadmap(newRoadmap);
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true); // Start loading
    await logoutUser();
    setIsLoggingOut(false); // End loading
};


  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 750);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!document.querySelector('.user-area').contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);


  return (
    <>
      <div className={`sidebar ${isSidebarVisible ? 'active' : ''}`}>
        <div className="nav-container">
        <div className="sidebar-header">
    {/* Use button instead of a and handle the click event */}
    <button 
    
      onClick={() => window.open("https://example.com/news", "_blank")} 
      className="nav-item news-button"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="platform-name-icon" />
      Check out news
    </button>
</div>

          <hr className="header-border" />
          <div className="nav-container-items">
          <button className="nav-item" onClick={handleAddRoadmapClick}>
            <FontAwesomeIcon icon={faPlus} className="fa-icon" />
            Add Roadmap
          </button>
          {/* ... other nav items */}
          </div>
        </div>
        <div className="user-area" onBlur={closeDropdown}>
        <div className="user-name" onClick={toggleDropdown}>
      <span>{user ? user.username : 'Fetching user info...'}</span>
        <FontAwesomeIcon icon={faCog} className="platform-icon" />
          </div>
          <div className={`dropdown-menu-username ${isDropdownVisible ? 'visible' : ''}`}>
              <div className="dropdown-item">
                <FontAwesomeIcon icon={faCog} className="dropdown-item-icon" />
                Settings
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
    {isLoggingOut ? (
        <div className="spinner-for-all"></div>
    ) : (
        <>
            <FontAwesomeIcon icon={faRightFromBracket} className="dropdown-item-icon" />
            Log out
        </>
    )}
</div>
            </div>
        </div>
        {isSmallScreen && (
           <button onClick={toggleSidebar} className={`toggle-btn-sidebar ${isSidebarVisible ? '' : 'toggle-btn-sidebar-closed'}`}>
           <FontAwesomeIcon icon={isSidebarVisible ? faArrowDown : faArrowUp} />
         </button>
        )}
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onAddSuccess={handleAddSuccess}
 />
      )}
    </>
  );
};

export default Sidebar;
