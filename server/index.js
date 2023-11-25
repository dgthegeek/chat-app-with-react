const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
app.use(cors());

// Create a connection pool
const pool = mysql.createPool({
    host: 'db4free.net',
    user: 'damedame',
    password: 'damedame',
    database: 'damedame',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  
  // Function to create tables
  async function createTables() {
    const connection = await pool.getConnection();
    try {
      // SQL query to create 'messages' table
      const createMessagesTableQuery = `
        CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          text VARCHAR(255) NOT NULL,
          uid VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
  
      // SQL query to create 'users' table
      const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
  
      // Execute queries
      await connection.query(createMessagesTableQuery);
      console.log('Messages table created successfully');
  
      await connection.query(createUsersTableQuery);
      console.log('Users table created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  }
  
  // Initialize tables when the server starts
  createTables();
  

app.use(express.json());

let currentUser = null; // Variable to store the current authenticated user

app.post('/signIn', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve user from the database based on the provided username
    const [userData] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (!userData || userData.length === 0) {
      // User not found
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password using bcrypt
    const passwordMatch = await bcrypt.compare(password, userData[0].password);

    if (!passwordMatch) {
      // Incorrect password
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set the current user
    currentUser = {
      uid: userData[0].uid,
      username: userData[0].username,
      // Add other user details as needed
    };

    // Return user details on successful sign-in
    res.json(currentUser);
    
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/logOut', (req, res) => {
  // Clear the current user
  currentUser = null;
  res.json({ message: 'Logged out successfully' });
});

app.get('/checkAuthStatus', (req, res) => {
  // Check if there is a current user
  if (currentUser) {
    res.json(currentUser);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.post('/register', async (req, res) => {
  console.log('hi');
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch messages
app.get('/messages', async (req, res) => {
    try {
      // Retrieve messages from the database
      const [messages] = await pool.query('SELECT * FROM messages ORDER BY createdAt ASC');
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Send message
app.post('/sendMessage', async (req, res) => {
    const { text, uid } = req.body;
  
    try {
      // Insert the new message into the database
      await pool.query('INSERT INTO messages (text, uid, createdAt) VALUES (?, ?, NOW())', [text, uid]);
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
