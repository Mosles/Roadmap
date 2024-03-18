// controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// Async handler removes the need for try-catch in all routes
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (users.length) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const [result] = await pool.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, passwordHash]);
  
  if (result.affectedRows > 0) {
    const token = generateToken(result.insertId); // Generate the token
    // Set token in an HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production environment
      sameSite: 'strict', // Strictly same site
      maxAge: 24 * 60 * 60 * 1000 // Cookie expires after 24 hours
    });

    // sweet changes
    // Send back a response without the token
    res.status(201).json({ id: result.insertId, username });
  } else {
    res.status(400).json({ message: 'Failed to create user' });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username }); // Log username attempting to login

  // Check for user by username
  const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

  if (user.length && await bcrypt.compare(password, user[0].password_hash)) {
      // Generate and set the token
      const token = generateToken(user[0].id);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });

      // Fetch all roadmaps associated with the user
      const [roadmaps] = await pool.query('SELECT * FROM roadmaps WHERE user_id = ?', [user[0].id]);
      console.log('Roadmaps fetched for user:', roadmaps.length); // Log how many roadmaps were fetched

      // Get current time
      const currentTime = new Date();

      // Iterate over each roadmap to check if a reset is needed
      for (const roadmap of roadmaps) {
          const resetAt = new Date(roadmap.reset_at);
          const timeDiff = (currentTime - resetAt) / (1000 * 60 * 60);
          console.log(`Checking roadmap (ID: ${roadmap.id}) for reset. Time since last reset: ${timeDiff} hours`); // Log roadmap check

       // Inside the login function, when a reset is needed
if (timeDiff >= 24) {
  console.log(`Archiving and resetting roadmap (ID: ${roadmap.id}).`);
  
  // Call the archive function before resetting tasks
  const archiveSuccess = await archiveRoadmapData(roadmap.id);
  if (!archiveSuccess) {
    console.error('Failed to archive roadmap data');
    // Handle the error appropriately
  } else {
    // If archiving was successful, then proceed with resetting tasks
    const [updateTasksResult] = await pool.query('UPDATE tasks SET status = "pending" WHERE roadmap_id = ?', [roadmap.id]);
    console.log(`Tasks reset for roadmap (ID: ${roadmap.id}), affected rows: ${updateTasksResult.affectedRows}`);
    
    const [updateRoadmapResult] = await pool.query('UPDATE roadmaps SET reset_at = NOW(), is_reset = TRUE WHERE id = ?', [roadmap.id]);
    console.log(`Reset time updated for roadmap (ID: ${roadmap.id}), affected rows: ${updateRoadmapResult.affectedRows}`);
  }
}

        
      }

      // Send back the user info and successful login response
      res.json({ id: user[0].id, username: user[0].username, lastReset: roadmaps.map(r => ({ id: r.id, resetAt: r.reset_at })) });
  } else {
      res.status(401).json({ message: 'Invalid credentials' });
  }
});

const clearResetFlag = asyncHandler(async (req, res) => {
  const { roadmapId } = req.params;
  try {
      await pool.query('UPDATE roadmaps SET is_reset = FALSE WHERE id = ?', [roadmapId]);
      res.json({ message: 'Reset acknowledged successfully.' });
  } catch (error) {
      console.error('Error acknowledging reset:', error);
      res.status(500).json({ message: 'Failed to acknowledge reset', error: error.message });
  }
});

const archiveRoadmapData = async (roadmapId) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Archive the roadmap
    const [archivedRoadmapResult] = await connection.query(`
      INSERT INTO archived_roadmaps (original_roadmap_id, user_id, title, end_time)
      SELECT id, user_id, title, end_time FROM roadmaps WHERE id = ?`, 
      [roadmapId]
    );
    const archivedRoadmapId = archivedRoadmapResult.insertId;

    // Archive tasks associated with the roadmap
    const [tasks] = await connection.query(`
      INSERT INTO archived_tasks (archived_roadmap_id, title, priority, specific_time, status)
      SELECT ?, title, priority, specific_time, status FROM tasks WHERE roadmap_id = ?`, 
      [archivedRoadmapId, roadmapId]
    );

    // Archive comments associated with the tasks
    // This step assumes task titles are unique within a roadmap
    await connection.query(`
      INSERT INTO archived_comments (archived_task_id, user_id, text)
      SELECT at.id, c.user_id, c.text
      FROM comments c
      JOIN tasks t ON c.task_id = t.id
      JOIN archived_tasks at ON t.title = at.title AND at.archived_roadmap_id = ?
      WHERE t.roadmap_id = ?`, 
      [archivedRoadmapId, roadmapId]
    );

    // Delete comments after archiving
    await connection.query(`DELETE FROM comments WHERE task_id IN (SELECT id FROM tasks WHERE roadmap_id = ?)`, [roadmapId]);

    // Other archival operations, such as resetting tasks, can follow here

    await connection.commit();
    console.log(`Roadmap, tasks, and comments archived successfully.`);
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Error during the archival process:', error);
    return false;
  } finally {
    if (connection) await connection.release();
  }
};

const archive = asyncHandler(async (req, res) => {
  const { roadmapId } = req.params;
  const success = await archiveRoadmapData(roadmapId); // Call your utility function here
  
  if (success) {
    res.json({ message: "Roadmap archived successfully." });
  } else {
    res.status(500).json({ message: "Failed to archive roadmap." });
  }
});

const resetRoadmap = asyncHandler(async (req, res) => {
  const { roadmapId } = req.params;
  try {
    // Archive data first (which now includes deleting comments post-archiving)
    const archiveSuccess = await archiveRoadmapData(roadmapId);
    if (!archiveSuccess) throw new Error('Archiving failed');

    // Continue with resetting the roadmap status without deleting comments
    await pool.query('UPDATE tasks SET status = "pending" WHERE roadmap_id = ?', [roadmapId]);
    await pool.query('UPDATE roadmaps SET reset_at = NOW(), is_reset = TRUE WHERE id = ?', [roadmapId]);

    console.log(`Roadmap reset successfully for roadmap (ID: ${roadmapId}).`);
    res.json({ message: "Roadmap and associated tasks reset successfully." });
  } catch (error) {
    console.error('Error during roadmap reset:', error);
    res.status(500).json({ message: 'Error during roadmap reset', error: error.message });
  }
});



const getUserDetails = asyncHandler(async (req, res) => {
  //console.log('Fetching user details for user ID:', req.user);
  // req.user should be set by your protect middleware
  const [user] = await pool.query('SELECT id, username FROM users WHERE id = ?', [req.user]);
  if (user.length) {
    res.json({ id: user[0].id, username: user[0].username });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


const createRoadmap = asyncHandler(async (req, res) => {
  const { title, end_time } = req.body;
  const userId = req.user; // Assuming you have middleware to set req.user

  if (!title || !userId) {
      return res.status(400).json({ message: 'Title and user ID are required.' });
  }

  try {
      const [result] = await pool.query(
          'INSERT INTO roadmaps (user_id, title, end_time) VALUES (?, ?, ?)',
          [userId, title, end_time]
      );

      if (result.affectedRows > 0) {
          const newRoadmap = { id: result.insertId, userId, title, end_time };
          console.log("Roadmap created successfully:", newRoadmap);
          res.status(201).json(newRoadmap);
      } else {
          throw new Error('Insert operation failed');
      }
  } catch (error) {
      console.error('Error creating roadmap:', error);
      res.status(500).json({ message: 'Error creating roadmap', error: error.message });
  }
});


const getRoadmaps = asyncHandler(async (req, res) => {
  const userId = req.user; // Assuming req.user contains the authenticated user's ID

  try {
    // Get all roadmaps for the user
    const [roadmaps] = await pool.query('SELECT * FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    
    res.json(roadmaps);
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const createTask = asyncHandler(async (req, res) => {
  const { roadmap_id, title, specific_time } = req.body;

  // Verify that the provided roadmap_id exists
  const [roadmap] = await pool.query('SELECT id FROM roadmaps WHERE id = ?', [roadmap_id]);
  if (roadmap.length === 0) {
    return res.status(404).json({ message: 'Roadmap not found' });
  }

  // Insert the new task into the unified tasks table
  try {
    const [result] = await pool.query('INSERT INTO tasks (roadmap_id, title, specific_time, status) VALUES (?, ?, ?, "pending")', 
                                      [roadmap_id, title, specific_time]);
    if (result.affectedRows > 0) {
      const newTask = { id: result.insertId, roadmap_id, title, specific_time, status: 'pending' };
      res.status(201).json(newTask);
    } else {
      throw new Error('Failed to insert task');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});



const getTasksByRoadmap = asyncHandler(async (req, res) => {
  const { roadmapId } = req.params;
  
  try {
    // Since all tasks are now treated the same, we don't need to switch based on roadmap type
    // Just ensure the roadmap exists
    const [roadmapCheck] = await pool.query('SELECT id FROM roadmaps WHERE id = ?', [roadmapId]);
    if (roadmapCheck.length === 0) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Use the unified tasks table for fetching tasks
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE roadmap_id = ?', [roadmapId]);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks for roadmap:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


const logoutUser = asyncHandler(async (req, res) => {
  // Clear the cookie named 'token'
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Set it to a past date
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body; // Assuming 'status' is sent in the request body

  if (!['pending', 'completed'].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  // Update the task status in the database
  const [result] = await pool.query(
    `UPDATE tasks SET status = ? WHERE id = ?`, 
    [status, taskId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task status updated successfully" });
});

const createComment = asyncHandler(async (req, res) => {
  const { task_id, user_id, text } = req.body;

  // Insert the new comment into the comments table
  try {
    const [result] = await pool.query('INSERT INTO comments (task_id, user_id, text) VALUES (?, ?, ?)', 
                                      [task_id, user_id, text]);
    if (result.affectedRows > 0) {
      const newComment = { id: result.insertId, task_id, user_id, text, created_at: new Date() };
      res.status(201).json(newComment);
    } else {
      throw new Error('Failed to insert comment');
    }
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
});

const getCommentsByTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  try {
    // Modify the query to join the users table and select the username along with comment fields
    const [comments] = await pool.query(`
      SELECT comments.*, users.username 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE task_id = ? 
      ORDER BY comments.created_at DESC
    `, [taskId]);
    res.json(comments);
  } catch (error) {
    console.error(`Error fetching comments for task ${taskId}:`, error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  createRoadmap,
  getRoadmaps,
  createTask,
  getTasksByRoadmap,
  updateTaskStatus,
  createComment,
  getCommentsByTask,
  resetRoadmap,
  clearResetFlag,
  archiveRoadmapData,
  archive,
};