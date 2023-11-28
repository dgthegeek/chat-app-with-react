const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors());
app.use(express.json());

const jwtSecret = 'your-secret-key';

// Create a connection pool
const pool = mysql.createPool({
  host: 'db4free.net',
  user: 'damedame',
  password: 'damedame',
  database: 'damedame',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 20000,
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
        uid VARCHAR(36) NOT NULL,
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

// Middleware to check JWT on protected routes
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

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

    // Generate a JWT token
    const token = jwt.sign({ username: userData[0].username, uid: userData[0].uid }, jwtSecret, {
      expiresIn: '1h', // Token expiration time
    });

    res.json({ token, username: userData[0].username });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/logOut', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/checkAuthStatus', authenticateJWT, (req, res) => {
  // Return user details based on the JWT
  res.json(req.user);
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Generate a uid for the new user
    const uid = uuidv4();

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database with the generated uid
    await pool.query('INSERT INTO users (uid, username, password) VALUES (?, ?, ?)', [uid, username, hashedPassword]);

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

app.get('/username/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // Retrieve the username from the database based on the uid
    const [user] = await pool.query('SELECT username FROM users WHERE uid = ?', [uid]);

    if (user && user.length > 0) {
      res.json({ username: user[0].username });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching username:', error);
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
