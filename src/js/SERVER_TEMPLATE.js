// ===== BACKEND SERVER TEMPLATE =====
// Copy ke file server.js atau app.js di backend Anda

/*
INSTALASI DEPENDENCIES:
npm install express cors dotenv

JALANKAN SERVER:
node server.js

ENDPOINT YANG TERSEDIA:
- POST   /api/logs/chat          - Log chat message
- POST   /api/chats/save         - Save chat session
- GET    /api/chats/history/:username - Get user chat history
- DELETE /api/chats/:username/:chatId  - Delete specific chat
*/

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ===== HELPER FUNCTIONS =====
function sanitizeFilename(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
}

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getUserChatDir(username) {
  const sanitized = sanitizeFilename(username);
  return path.join(__dirname, 'chats', sanitized);
}

function getUserLogDir(username) {
  const sanitized = sanitizeFilename(username);
  return path.join(__dirname, 'logs', sanitized);
}

// ===== ROUTES =====

/**
 * POST /api/logs/chat
 * Logs individual chat message to user's savechat.log
 */
app.post('/api/logs/chat', (req, res) => {
  try {
    const { username, content, sender, chatId, timestamp } = req.body;

    // Validation
    if (!username || !content || !sender) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: username, content, sender'
      });
    }

    const logDir = getUserLogDir(username);
    ensureDirectory(logDir);

    const logPath = path.join(logDir, 'savechat.log');

    // Format log entry
    const logEntry = JSON.stringify({
      timestamp: timestamp || new Date().toISOString(),
      sender: sender, // 'user' or 'ai'
      content: content,
      chatId: chatId || 'default'
    }) + '\n';

    // Append to log file
    fs.appendFileSync(logPath, logEntry, 'utf8');

    console.log(`✓ Logged message from ${username} (${sender})`);

    res.json({
      success: true,
      message: 'Message logged successfully'
    });
  } catch (error) {
    console.error('❌ Logging error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/chats/save
 * Saves complete chat session
 */
app.post('/api/chats/save', (req, res) => {
  try {
    const { username, chatData, timestamp } = req.body;

    if (!username || !chatData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: username, chatData'
      });
    }

    const chatsDir = getUserChatDir(username);
    ensureDirectory(chatsDir);

    const sessionId = chatData.id || Date.now().toString();
    const chatPath = path.join(chatsDir, `${sessionId}.json`);

    // Save chat data
    const saveData = {
      ...chatData,
      savedAt: timestamp || new Date().toISOString(),
      username: username
    };

    fs.writeFileSync(chatPath, JSON.stringify(saveData, null, 2), 'utf8');

    console.log(`✓ Saved chat session for ${username} (ID: ${sessionId})`);

    res.json({
      success: true,
      message: 'Chat saved successfully',
      sessionId: sessionId
    });
  } catch (error) {
    console.error('❌ Chat save error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/chats/history/:username
 * Retrieves user's chat history
 */
app.get('/api/chats/history/:username', (req, res) => {
  try {
    const { username } = req.params;
    const chatsDir = getUserChatDir(username);

    if (!fs.existsSync(chatsDir)) {
      return res.json({ chats: [] });
    }

    const files = fs.readdirSync(chatsDir);
    const chats = [];

    files.forEach(file => {
      if (file.endsWith('.json')) {
        try {
          const data = fs.readFileSync(path.join(chatsDir, file), 'utf8');
          chats.push(JSON.parse(data));
        } catch (e) {
          console.warn(`Could not parse ${file}:`, e.message);
        }
      }
    });

    // Sort by savedAt descending (newest first)
    chats.sort((a, b) => {
      const dateA = new Date(a.savedAt || 0);
      const dateB = new Date(b.savedAt || 0);
      return dateB - dateA;
    });

    console.log(`✓ Retrieved ${chats.length} chats for ${username}`);

    res.json({ chats: chats });
  } catch (error) {
    console.error('❌ History fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/chats/:username/:chatId
 * Deletes a specific chat
 */
app.delete('/api/chats/:username/:chatId', (req, res) => {
  try {
    const { username, chatId } = req.params;
    const chatsDir = getUserChatDir(username);
    const chatPath = path.join(chatsDir, `${chatId}.json`);

    if (!fs.existsSync(chatPath)) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found'
      });
    }

    fs.unlinkSync(chatPath);
    console.log(`✓ Deleted chat ${chatId} for ${username}`);

    res.json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/logs/:username
 * Retrieves full chat log for user
 */
app.get('/api/logs/:username', (req, res) => {
  try {
    const { username } = req.params;
    const logDir = getUserLogDir(username);
    const logPath = path.join(logDir, 'savechat.log');

    if (!fs.existsSync(logPath)) {
      return res.json({ logs: [] });
    }

    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    const logs = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    }).filter(log => log !== null);

    console.log(`✓ Retrieved ${logs.length} log entries for ${username}`);

    res.json({ logs: logs });
  } catch (error) {
    console.error('❌ Log retrieval error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     WhiteGPT Chat Backend Server       ║
║          Running on Port ${PORT}         ║
╚════════════════════════════════════════╝

📁 Directories:
   • Chats: ./chats/
   • Logs:  ./logs/

✅ Ready to receive connections...
  `);

  // Initialize directories
  ensureDirectory(path.join(__dirname, 'chats'));
  ensureDirectory(path.join(__dirname, 'logs'));
});

// ===== .env FILE TEMPLATE =====
/*
PORT=3000
CORS_ORIGIN=http://localhost:5000,http://localhost:3000
NODE_ENV=development
*/
