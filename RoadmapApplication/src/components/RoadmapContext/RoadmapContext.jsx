// src/contexts/RoadmapContext.js
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const RoadmapContext = createContext();

export const useRoadmap = () => useContext(RoadmapContext);

export const RoadmapProvider = ({ children }) => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [user, setUser] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    const [commentsByTaskId, setCommentsByTaskId] = useState({});
    const [lastReset, setLastReset] = useState(null);
    const [roadmapResetNeeded, setRoadmapResetNeeded] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkForToken = () => {
        return !!document.cookie.split('; ').find(row => row.startsWith('token='));
      };
      
    // Added useEffect to check if the user is already logged in when the app starts
    useEffect(() => {
        const init = async () => {
            await authenticateUser();
            await fetchCsrfToken();
            // Any other initialization logic can go here
        };
        init();
    }, []);

      const fetchCsrfToken = async () => {
        const response = await fetch('/csrf-token', { credentials: 'include' });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
    };
      
      
    const fetchRoadmaps = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/roadmaps', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch roadmaps');
            const roadmapsData = await response.json();
            setRoadmaps(roadmapsData);
        } catch (error) {
            console.error('Error fetching roadmaps:', error);
        }
    }, []);

    const authenticateUser = useCallback(async () => {
        const startTime = Date.now();
        setLoading(true); // Start loading before fetching user data
    
        try {
            const response = await fetch('/api/auth/user', { credentials: 'include' });
            if (response.ok) {
                const userDetails = await response.json();
                setUser(userDetails);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to authenticate user:', error);
            setUser(null);
        } finally {
            const endTime = Date.now();
            const timeDiff = endTime - startTime;
    
            // Ensure loading state lasts at least 2 seconds
            if (timeDiff < 2000) {
                setTimeout(() => {
                    setLoading(false);
                }, 2000 - timeDiff);
            } else {
                setLoading(false);
            }
        }
    }, []);
    
    const loginUser = async (username, password) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const userDetails = await response.json();
                setUser(userDetails);
            } else {
                console.error('Login failed');
                setUser(null); // Optionally handle errors more gracefully
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const logoutUser = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST', // Assuming the logout is a POST request
                credentials: 'include', // Include cookies in the request
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken, // Include CSRF token for security
                },
            });
            if (response.ok) {
                setUser(null); // Reset user state to null after successful logout
                // Optionally: Redirect the user to the landing page or login page
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    

    const registerUser = async (username, password) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const userDetails = await response.json();
                setUser(userDetails);
                return { success: true };
            } else {
                const errorData = await response.json();
                // This includes handling specific messages like 'User already exists'
                return { success: false, errors: errorData.errors || [errorData.message || 'Registration failed. Please try again.'] };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, errors: ['Registration failed due to an unexpected error.'] };
        }
    };
    

    const addRoadmap = useCallback(async (roadmapDetails) => {
        try {
            const response = await fetch('/api/auth/roadmaps', {
                method: 'POST',
                credentials: 'include', // Ensures cookies, including the CSRF token cookie, are sent with the request
                headers: { 
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken, // Includes the CSRF token in the request headers
                },
                body: JSON.stringify(roadmapDetails),
            });
            if (!response.ok) {
                // Handling server errors or validation errors
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create roadmap');
            }
            const newRoadmap = await response.json();
            // Directly update the roadmaps state to include the newly added roadmap
            setRoadmaps(currentRoadmaps => [...currentRoadmaps, newRoadmap]);
        } catch (error) {
            console.error('Error creating roadmap:', error);
        }
    }, [csrfToken]);
    
    
    const addTaskToRoadmap = async (taskDetails) => {
        try {
            const response = await fetch('/api/auth/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(taskDetails),
            });
            if (!response.ok) throw new Error('Failed to create task');
            
            // Assuming task creation was successful, refetch the tasks for the specific roadmap
            fetchTasksForRoadmap(taskDetails.roadmap_id); // Make sure to pass the correct roadmap ID
        } catch (error) {
            console.error('Error adding task to roadmap:', error);
        }
    };
    
    
    const handleTaskStatusChange = async (taskId, isCompleted, roadmapId) => {
        const newStatus = isCompleted ? 'completed' : 'pending';
        try {
            const response = await fetch(`/api/auth/tasks/${taskId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error('Failed to update task status');
    
            // Refresh the tasks for the specific roadmap to reflect the updated task status correctly
            await fetchTasksForRoadmap(roadmapId);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };
    
    
    
    const deleteTaskFromRoadmap = async (taskId, roadmapId) => {
        try {
            const response = await fetch(`/api/auth/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken,
                },
                credentials: 'include',
            });
    
            if (!response.ok) throw new Error('Failed to delete task');
    
            // Update local state of roadmaps to reflect the deletion of the task
            setRoadmaps(currentRoadmaps => currentRoadmaps.map(roadmap => {
                if (roadmap.id === roadmapId) {
                    const remainingTasks = roadmap.tasks.filter(task => task.id !== taskId);
                    return { ...roadmap, tasks: remainingTasks };
                }
                return roadmap;
            }));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };    
    
    // Add this new function to fetch tasks for a specific roadmap
    const fetchTasksForRoadmap = async (roadmapId) => {
        try {
            const response = await fetch(`/api/auth/roadmaps/${roadmapId}/tasks`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`Failed to fetch tasks for roadmap ${roadmapId}`);
            const tasks = await response.json();
    
            // Correctly updating only the specified roadmap's tasks
            setRoadmaps(currentRoadmaps => currentRoadmaps.map(roadmap => {
                if (roadmap.id === roadmapId) {
                    return { ...roadmap, tasks };
                }
                return roadmap;
            }));
        } catch (error) {
            console.error(`Error fetching tasks for roadmap ${roadmapId}:`, error);
        }
    };
    
    
    
      const updateRoadmapWithNewTask = useCallback((roadmapId, newTask) => {
        setRoadmaps(currentRoadmaps => currentRoadmaps.map(roadmap => {
            if (roadmap.id === roadmapId) {
                // Check if the roadmap has a tasks array and append the new task
                const updatedTasks = roadmap.tasks ? [...roadmap.tasks, newTask] : [newTask];
                return { ...roadmap, tasks: updatedTasks };
            }
            return roadmap;
        }));
    }, []);
    

// In RoadmapContext.js
const addCommentToTask = async (commentDetails) => {
  const { task_id, text, user_id } = commentDetails;
  try {
    const response = await fetch('/api/auth/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ task_id, text, user_id }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add comment');
    }
    const newComment = await response.json();
    return newComment; // Just return the new comment, no global state update
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

const fetchCommentsForTask = useCallback(async (taskId) => {
try {
const response = await fetch(`/api/auth/tasks/${taskId}/comments`, {
    headers: {
    'Content-Type': 'application/json',
    'CSRF-Token': csrfToken,
    },
    credentials: 'include',
});
if (!response.ok) throw new Error(`Failed to fetch comments for task ${taskId}`);
const comments = await response.json();
return comments; // Just return the comments, no global state update
} catch (error) {
console.error(`Error fetching comments for task ${taskId}:`, error);
return []; // Return an empty array in case of error
}
}, [csrfToken]);

// Add a new function within your RoadmapProvider
const archiveRoadmapBeforeReset = useCallback(async (roadmapId) => {
    try {
        // Assuming the endpoint is '/api/auth/roadmaps/:roadmapId/archive'
        const response = await fetch(`/api/auth/roadmaps/${roadmapId}/archive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,
            },
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to archive roadmap');
        }
        // Optionally handle response data here
        console.log('Roadmap archived successfully');
    } catch (error) {
        console.error('Error archiving roadmap:', error);
    }
}, [csrfToken]);

// Modify the acknowledgeReset function to call archiveRoadmapBeforeReset before clearing the reset flag
const acknowledgeReset = useCallback(async (roadmapId) => {
    try {
        // Archive the roadmap before resetting it
        await archiveRoadmapBeforeReset(roadmapId); // This function calls the archival endpoint

        // Then proceed to clear the reset flag as before
        const response = await fetch(`/api/auth/roadmaps/${roadmapId}/clear-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,
            },
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to acknowledge roadmap reset');
        
        // Update the local state as necessary
        console.log('Roadmap reset acknowledged and archived successfully.');
    } catch (error) {
        console.error('Error during roadmap reset acknowledgment and archival:', error);
    }
}, [csrfToken, archiveRoadmapBeforeReset]); // Ensure dependencies are correctly listed

    return (
        <RoadmapContext.Provider value={{ 
          roadmaps, 
          user, 
          fetchRoadmaps, 
          addRoadmap, 
          updateRoadmapWithNewTask, 
          authenticateUser, 
          loginUser, 
          logoutUser,
          registerUser,
          csrfToken,
          addTaskToRoadmap,
          handleTaskStatusChange,
          deleteTaskFromRoadmap,
          fetchCommentsForTask,
          addCommentToTask,
          commentsByTaskId,
          acknowledgeReset,
          archiveRoadmapBeforeReset,
          loading,
          checkForToken,
        }}>
          {children}
        </RoadmapContext.Provider>
    );
};
