import React, { useState } from 'react';
import { useRoadmap } from '../RoadmapContext/RoadmapContext'; // Ensure correct import path
import './Task.css';

const Task = ({ onCancel, roadmapId }) => {
  const [taskName, setTaskName] = useState('');
  const [specificTime, setSpecificTime] = useState('00:00'); // Default to midnight
  const { addTaskToRoadmap } = useRoadmap();
  const [isLoading, setIsLoading] = useState(false);

  // Generate time options for the entire 24-hour cycle
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ['00', '30']) {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleSave = async () => {
    if (!taskName) return;
    setIsLoading(true);

    await addTaskToRoadmap({
      roadmap_id: roadmapId,
      title: taskName,
      specific_time: specificTime, // Use the selected specific time
    });

    setIsLoading(false);
    onCancel(); // Close the form or clear the fields
  };

  return (
    <div className="add-task-form">
      <label htmlFor="taskName" className="input-label">Task Description</label>
      <input
        id="taskName"
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="task-input"
        disabled={isLoading}
      />

      <label htmlFor="specificTime" className="input-label">Specific Time</label>
      <select
        id="specificTime"
        value={specificTime}
        onChange={(e) => setSpecificTime(e.target.value)}
        className="task-select"
        disabled={isLoading}
      >
        {timeOptions.map((time, index) => (
          <option key={index} value={time}>{time}</option>
        ))}
      </select>

      <div className="task-actions">
        {isLoading ? (
          <div className="spinner-for-all"></div>
        ) : (
          <>
            <button onClick={handleSave} className="save-task-button">Add Task</button>
            <button onClick={onCancel} className="cancel-task-button">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Task;
