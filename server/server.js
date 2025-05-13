const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'signup',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Session store
const sessionStore = new MySQLStore({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'signup',
  port: 3306
}, pool);

app.use(session({
  key: 'session_cookie_name',
  secret: 'your_session_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Test database connection
async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database ✅');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    console.log('Authenticated user:', req.session.user.email);
    next();
  } else {
    console.log('Unauthenticated access attempt');
    res.status(401).json({ message: 'Not authenticated' });
  }
};

// Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'User not found' });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Password comparison failed for user:', email);
      return res.status(400).json({ message: 'Incorrect password' });
    }
    req.session.user = { name: user.name, email: user.email };
    console.log('Login successful:', email);
    res.json({
      message: 'Success',
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Signup attempt:', { name, email });
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Email already in use:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    req.session.user = { name, email };
    console.log('Signup successful:', email);
    res.json({ success: true, message: 'Account created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Profile Endpoint with quiz stats
app.get('/profile', isAuthenticated, async (req, res) => {
  const userEmail = req.session.user.email;

  try {
    const [[user]] = await pool.query('SELECT id, name, xp FROM users WHERE email = ?', [userEmail]);
    const [[stats]] = await pool.query(`
      SELECT COUNT(*) AS quizzesTaken, AVG(quiz_score) AS averageScore
      FROM user_progress
      WHERE user_id = ? AND quiz_score IS NOT NULL
    `, [user.id]);

    const level = Math.floor(Math.sqrt(user.xp / 10));

    res.json({
      name: user.name,
      email: userEmail,
      quizzesTaken: stats.quizzesTaken || 0,
      averageScore: stats.averageScore !== null ? parseFloat(stats.averageScore).toFixed(2) : "0.0",
      xp: user.xp,
      level
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Database error' });
  }
});


// Logout Endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    console.log('Logout successful');
    res.json({ message: 'Logged out successfully' });
  });
});

// Tutorials Endpoint (All Tutorials)
app.get('/tutorials', isAuthenticated, async (req, res) => {
  try {
    const [tutorials] = await pool.query('SELECT id, title, category, description, created_at FROM tutorials');
    console.log('Fetched tutorials:', tutorials);
    res.json(tutorials);
  } catch (err) {
    console.error('Error fetching tutorials:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Tutorial by ID Endpoint
app.get('/tutorials/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const [tutorials] = await pool.query('SELECT id, title, content, quiz, category, description, created_at FROM tutorials WHERE id = ?', [id]);
    if (tutorials.length === 0) {
      console.log('Tutorial not found:', id);
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    console.log('Fetched tutorial:', tutorials[0]);
    res.json(tutorials[0]);
  } catch (err) {
    console.error('Error fetching tutorial:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// User Progress Endpoint
app.get('/user/progress', isAuthenticated, async (req, res) => {
  try {
    res.json({ completed: 0 }); // Placeholder
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        u.id, u.name, u.email, u.xp,
        COUNT(DISTINCT up.tutorial_id) AS tutorialsCompleted,
        ROUND(AVG(up.quiz_score), 1) AS averageScore,
        COUNT(b.id) AS badgeCount
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id AND up.completed = 1
      LEFT JOIN badges b ON u.id = b.user_id
      GROUP BY u.id
      ORDER BY u.xp DESC, averageScore DESC
      LIMIT 10
    `);
    res.json(results);
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    res.status(500).json({ message: "Database error" });
  }
});



// Quiz Submission Endpoint with score update
app.post('/tutorials/:id/quiz', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  const userEmail = req.session.user.email;

  try {
    const [[user]] = await pool.query('SELECT id FROM users WHERE email = ?', [userEmail]);

    await pool.query(`
      INSERT INTO user_progress (user_id, tutorial_id, quiz_score, completed)
      VALUES (?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE quiz_score = VALUES(quiz_score), completed = 1
    `, [user.id, id, score]);

    // ✅ Award XP based on score
    let xpToAdd = 10;
    if (score >= 80) xpToAdd += 10;
    if (score >= 90) xpToAdd += 5;
    await pool.query('UPDATE users SET xp = xp + ? WHERE id = ?', [xpToAdd, user.id]);

    res.json({ message: 'Quiz score saved, XP awarded' });
  } catch (err) {
    console.error('Error saving quiz score:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.get('/user/badges', isAuthenticated, async (req, res) => {
  try {
    const [[user]] = await pool.query('SELECT id FROM users WHERE email = ?', [req.session.user.email]);
    const [badges] = await pool.query(
      'SELECT title, awarded_at FROM badges WHERE user_id = ? ORDER BY awarded_at DESC',
      [user.id]
    );
    res.json(badges);
  } catch (err) {
    console.error("Error fetching badges:", err);
    res.status(500).json({ message: "Database error" });
  }
});


// Tutorial Completion Endpoint
app.post('/tutorials/:id/complete', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userEmail = req.session.user.email;

  try {
    const [[user]] = await pool.query('SELECT id FROM users WHERE email = ?', [userEmail]);

    // Mark tutorial as completed
    await pool.query(`
      INSERT INTO user_progress (user_id, tutorial_id, completed)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE completed = 1
    `, [user.id, id]);

    // ✅ Award XP (+10 for completing tutorial)
    await pool.query('UPDATE users SET xp = xp + 10 WHERE id = ?', [user.id]);

    // ✅ Award badge for tutorial
    await pool.query(`
      INSERT IGNORE INTO badges (user_id, title)
      VALUES (?, ?)
    `, [user.id, `Completed Tutorial ${id}`]);

    res.json({ message: 'Tutorial marked complete, XP and badge awarded' });
  } catch (err) {
    console.error("Error in tutorial completion:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Initialize server
async function startServer() {
  try {
    await testDbConnection();
    app.listen(8081, () => {
      console.log('Server running on http://localhost:8081 🚀');
    });
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

startServer();
