// TaskModal.js
import React from 'react';
import { useState, useEffect } from 'react'; // Import useState
import './TaskModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRoadmap } from '../RoadmapContext/RoadmapContext';
import {
  faSmile,
  faSadTear,
  faMeh,
  faCheck,
  faCommentDots,
  faCalendarAlt,
  faClock,
  faTimes,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

// Function to calculate the priority icon based on the specific time
const getPriorityIconWithColor = (specificTime) => {
    if (!specificTime) return null;

    // Example specificTime format is "HH:MM"
    const currentTime = new Date();
    const [hours, minutes] = specificTime.split(':').map(Number);
    let taskTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), hours, minutes);

    // Adjust for next day if necessary, although this part is only needed if comparing current time with task time
    if (taskTime < currentTime) {
      taskTime.setDate(taskTime.getDate() + 1);
    }

    const timeDifference = (taskTime - currentTime) / (1000 * 60 * 60); // Convert to hours

    if (timeDifference <= 3) {
        return <FontAwesomeIcon icon={faSadTear} style={{ color: 'red' }} />;
    } else if (timeDifference <= 6) {
        return <FontAwesomeIcon icon={faMeh} style={{ color: 'orange' }} />;
    } else {
        return <FontAwesomeIcon icon={faSmile} style={{ color: 'green' }} />;
    }
};

const TaskModal = ({ task, onClose, roadmapName, roadmapEndDate, onTaskComplete, roadmapId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [localTask, setLocalTask] = useState(task);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addCommentToTask, fetchCommentsForTask, user } = useRoadmap();


  useEffect(() => {
    // Refetch comments every time the task changes
    if (task && task.id) {
      setIsLoadingComments(true); // Start loading
      fetchCommentsForTask(task.id).then(newComments => {
        setComments(newComments || []);
        setIsLoadingComments(false); // End loading
      });
    }
  }, [task, fetchCommentsForTask]);

    if (!task) return null;

    const formattedRoadmapEndDate = new Date(roadmapEndDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    // Directly use the specific_time without conversion for consistency
    const formattedTaskSpecificTime = task.specific_time 
    ? task.specific_time.substr(0, 5) // Trims the time string to the first 5 characters, effectively removing seconds
    : 'No specific time';


    const handleCommentSubmit = async () => {
      if (comment.trim() && user) {
        setIsLoadingComments(true); // Start loading
        const newCommentDetails = {
          task_id: task.id,
          user_id: user.id,
          text: comment,
        };
        const createdComment = await addCommentToTask(newCommentDetails);
        if (createdComment) {
          // Refetch comments to include the new one
          const updatedComments = await fetchCommentsForTask(task.id);
          setComments(updatedComments || []);
          setComment(''); // Clear the input field
        }
        setIsLoadingComments(false); // End loading
      }
    };
    

  const statusIcon = localTask.status === 'completed' 
        ? <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> 
        : getPriorityIconWithColor(localTask.specific_time);

        const askConfirmation = () => {
          setShowConfirmation(true);
        };
      

        const completeTask = async () => {
          if (onTaskComplete && localTask && roadmapId) {
            await onTaskComplete(localTask.id, true, roadmapId);
            setLocalTask({ ...localTask, status: 'completed' });
            setShowConfirmation(false); // Hide confirmation after task is completed
          }
        };

        console.log(comments);

    return (
      <div className="task-modal-backdrop" onClick={onClose}>
        <div className="task-modal-content" onClick={e => e.stopPropagation()}>
          {/* Task Modal Header */}
          <div className="task-modal-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>{roadmapName}</div>
            <button className="close-modal-button" onClick={onClose}>&times;</button>
          </div>
          {/* Task Modal Content */}
          <div className="content-container-taskmodal">
            {/* Sidebar */}
            <div className="task-modal-sidebar">
              <div className="sidebar-section">
                <h4 className="sidebar-title">Status</h4>
                <p>{statusIcon} {localTask.status.charAt(0).toUpperCase() + localTask.status.slice(1)}</p>
                <hr />
              </div>
              <div className="sidebar-section">
                <h4 className="sidebar-title">Time</h4>
                <p><FontAwesomeIcon icon={faClock} /> {formattedTaskSpecificTime}</p>
                <hr />
              </div>
              <div className="sidebar-section">
                <h4 className="sidebar-title">Roadmap</h4>
                <p><FontAwesomeIcon icon={faCalendarAlt} /> {formattedRoadmapEndDate}</p>
                <hr />
              </div>
            </div>
            {/* Main Content */}
            <div className="task-modal-main">
              <div className="modal-title">{localTask.title}</div>
              <div className="complete-task-button-container">
              {!showConfirmation && localTask.status !== 'completed' && (
                <button className="complete-task-button" onClick={askConfirmation}>Complete Task</button>
              )}
              {/* Confirmation Section */}
              {showConfirmation && (
                <div className="confirmation-section">
                  <p>Are you sure you want to do this?</p>
                  <button className="confirmation-button check" onClick={completeTask}><FontAwesomeIcon icon={faCheck} /></button>
                  <button className="confirmation-button close" onClick={() => setShowConfirmation(false)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>
              )}
              </div>
              <hr />
              <div className="comments-list-container">
  {isLoadingComments ? (
    <div className="spinner-for-all"></div> // Show loading spinner
  ) : (
    comments.map((commentObj, index) => (
      <div key={index} className="comment-item">
        <div className="comment-header">
          <span className="comment-username">{commentObj.username || 'Anonymous'}</span>
          <span className="comment-timestamp">{new Date(commentObj.created_at).toLocaleString()}</span>
        </div>
        <div className="comment-text">{commentObj.text}</div>
      </div>
    ))
  )}
</div>

              <div className="comments-container">
                <div className={`comment-input-wrapper ${isCommentExpanded ? 'expanded' : ''}`}>
                <input
    type="text"
    className="comment-input-field"
    value={comment} // Make sure you bind your state here
    onChange={(e) => setComment(e.target.value)} // Update the state on every change
    placeholder="Add a comment..."
    onFocus={() => setIsCommentExpanded(true)}
/>

               {isCommentExpanded && (
  <div className="comment-action-buttons">
    <button className="comment-button cancel" onClick={() => setIsCommentExpanded(false)}>Cancel</button>
    <button 
  className="comment-button comment" 
  onClick={(e) => {
    e.preventDefault(); // Prevent form submission if it's within a form
    handleCommentSubmit();
  }}>
    Comment
</button>

  </div>
)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default TaskModal;
