// RoadmapDetails.js
import React, { useState, useEffect } from 'react';
import './RoadmapDetails.css'; // Create and import CSS for styling
import Task from './../Task/Task';
import TaskModal from './../TaskModal/TaskModal'; // Adjust the import path according to your file structure

import { useRoadmap } from '../RoadmapContext/RoadmapContext'; // Adjust the import path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmile,
  faSadTear,
  faMeh,
  faCheck,
  faCaretDown,
  faTasks, // Assuming this is for general tasks
  faClipboardList, // For the task status summary
  faCalendarAlt // For the date
} from '@fortawesome/free-solid-svg-icons';


const RoadmapDetails = ({ roadmap }) => {
    const [tasks, setTasks] = useState([]);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { roadmaps } = useRoadmap();
    const [taskView, setTaskView] = useState('pending');
    const { handleTaskStatusChange } = useRoadmap();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    const pendingTasksCount = tasks.filter(task => task.status === 'pending').length;
const completedTasksCount = tasks.filter(task => task.status === 'completed').length;

// Function to toggle dropdown
const toggleDropdown = () => setShowDropdown(!showDropdown);

    const calculatePriority = (specificTime) => {
        const currentTime = new Date();
        let [hours, minutes] = specificTime.split(':').map(Number);
        let endTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), hours, minutes);
    
        // If the endTime is before the current time, it means the specific time is for the next day
        if (endTime < currentTime) {
            endTime.setDate(endTime.getDate() + 1); // Move endTime to the next day
        }
    
        const timeDifference = (endTime - currentTime) / (1000 * 60 * 60); // Convert to hours
    
        if (timeDifference <= 3) {
            return 'high';
        } else if (timeDifference <= 6) {
            return 'medium';
        } else {
            return 'low';
        }
    };
    
    const getPriorityIcon = (priority) => {
        switch (priority) {
          case 'high':
            // Use faSadTear for high priority
            return <FontAwesomeIcon icon={faSadTear} style={{ color: 'red' }} />;
          case 'medium':
            // Use faMeh for medium priority
            return <FontAwesomeIcon icon={faMeh} style={{ color: 'orange' }} />;
          case 'low':
            // Use faSmile for low priority
            return <FontAwesomeIcon icon={faSmile} style={{ color: 'green' }} />;
          default:
            return null;
        }
      };
      

    const formattedEndTime = roadmap.end_time
    ? new Date(roadmap.end_time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    : 'End date not set';

    useEffect(() => {
        const currentRoadmap = roadmaps.find(r => r.id === roadmap.id);
        if (currentRoadmap && currentRoadmap.tasks) {
            setTasks(currentRoadmap.tasks); // Update tasks state if currentRoadmap is found and has tasks
            setIsLoading(false); // Ensure to set loading to false
        }
    }, [roadmaps, roadmap.id]);
    
    useEffect(() => {
        const fetchTasks = async () => {
            if (!roadmap.id) { // Check if roadmap.id is defined
                console.error('Roadmap ID is undefined.');
                return;
            }
    
            setIsLoading(true);
            try {
                const response = await fetch(`/api/auth/roadmaps/${roadmap.id}/tasks`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) throw new Error(`Failed to fetch tasks for roadmap ${roadmap.id}`);
                const data = await response.json();
                setTasks(data);
                setIsLoading(false);
            } catch (error) {
                console.error(`Error fetching tasks for roadmap ${roadmap.id}:`, error);
                setIsLoading(false);
            }
        };
    
        fetchTasks();
    }, [roadmap.id]); // Depend on roadmap.id to ensure it's defined before fetching
    
    
    const handleAddTask = () => {
        setIsAddingTask(true);
    };

    const handleSaveTask = async (newTask) => {
        setIsAddingTask(false);
        // Merge the new task with existing tasks
        setTasks(prevTasks => [...prevTasks, newTask]);
    
        // Update the global state to reflect the change
        updateRoadmapWithNewTask(roadmap.id, newTask);
    };
    

    const handleCancelTask = () => {
        setIsAddingTask(false);
    };

    const renderTasks = () => {
        if (isLoading) {
            return <div className="spinner-for-all"></div>;
        }
    
        // Filter tasks based on the selected view and sort them by specific time
        const filteredTasks = tasks
            .filter(task => taskView === 'all' ? true : task.status === taskView)
            .sort((a, b) => {
                // Compare the times as HH:MM strings directly
                return a.specific_time.localeCompare(b.specific_time);
            });
    
        // Check if there are no tasks matching the filter
        if (filteredTasks.length === 0) {
            return <div className="no-tasks-message">{`No ${taskView} tasks yet`}</div>;
        }
    
        // If there are filtered tasks, render them
// If there are filtered tasks, render them
return (
    <>
    {filteredTasks.map((task, index) => (
        <div key={index} className={`task ${task.status === 'completed' ? 'task-completed' : ''}`}>
            <div className="task-content">
                <div className="task-description-details" onClick={() => handleTaskClick(task)}>
                    {task.title}
                </div>
                <div className="task-metadata">
                    <div className="priority-icon">{getPriorityIcon(calculatePriority(task.specific_time))}</div>
                    <div className="task-specific-time">{task.specific_time.slice(0, 5)}</div>
                </div>
            </div>
        </div>
    ))}
    {showModal && (
        <TaskModal
            task={selectedTask}
            onClose={closeModal}
            roadmapName={roadmap?.title}
            roadmapEndDate={roadmap?.end_time}
            onTaskComplete={handleTaskStatusChange}
            roadmapId={roadmap?.id}
        />
    )}
    </>
);

    };
    
    
    return (
        <>
            <div className="roadmap-details">
                <div className="roadmap-header-container">
                    <div className="roadmap-header">
                        <h3 className="roadmap-title-details">{roadmap.title}</h3>
                    </div>
                    <div className="task-controls-container">
    <div className="task-view-buttons">
    <button onClick={toggleDropdown}>
  <FontAwesomeIcon icon={taskView === 'pending' ? faClipboardList : faCheck} />
  {` ${taskView.charAt(0).toUpperCase() + taskView.slice(1)}`} <FontAwesomeIcon icon={faCaretDown} />
</button>

        {showDropdown && (
  <div className="dropdown-menu-task-status">
    <div onClick={() => { setTaskView('pending'); setShowDropdown(false); }}>
      <FontAwesomeIcon icon={faClipboardList} /> Pending
    </div>
    <div onClick={() => { setTaskView('completed'); setShowDropdown(false); }}>
      <FontAwesomeIcon icon={faCheck} /> Completed {/* Using checkmark icon here */}
    </div>
  </div>
)}

    </div>
    <div className="task-status-summary">
    <FontAwesomeIcon icon={taskView === 'pending' ? faClipboardList : faCheck} />
    {` ${taskView === 'pending' ? `${pendingTasksCount}/${tasks.length} Pending Tasks` : `${completedTasksCount}/${tasks.length} Completed Tasks`}`}
</div>


    <div className="roadmap-date">
        <FontAwesomeIcon icon={faCalendarAlt} /> {/* Icon next to date */}
        {` ${formattedEndTime}`}
    </div>
</div>
                </div>
                <div className="roadmap-tasks-details">{renderTasks()}</div>
                <hr className="task-divider" />
                {isAddingTask ? (
                    <Task onSave={handleSaveTask} onCancel={handleCancelTask} roadmapId={roadmap.id} />
                ) : (
                    <button className="add-task-button" onClick={handleAddTask}>+ Add Task</button>
                )}
            </div>
        </>
    );     
};


export default RoadmapDetails;
