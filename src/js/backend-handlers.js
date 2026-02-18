// backend-handlers.js - Backend API route handlers
// This file should be integrated with your Node.js/Express backend

/**
 * EXPRESS ROUTE EXAMPLES
 * 
 * Add these routes to your backend server (e.g., server.js or api.js)
 */

/*
// 1. Chat logging endpoint
app.post('/api/logs/chat', (req, res) => {
  const { username, content, sender, sessionId, chatId, timestamp } = req.body;
  
  const logPath = `./logs/${username}/savechat.log`;
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Create directory if not exists
    const dir = path.dirname(logPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Format log entry
    const logEntry = JSON.stringify({
      timestamp,
      sender,
      content,
      sessionId,
      chatId
    });
    
    // Append to log file
    fs.appendFileSync(logPath, logEntry + '\n');
    
    res.json({ success: true, message: 'Log saved' });
  } catch (error) {
    console.error('Logging error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Save chat session
app.post('/api/chats/save', (req, res) => {
  const { username, chatData, sessionId, timestamp } = req.body;
  const fs = require('fs');
  const path = require('path');
  
  const chatPath = `./chats/${username}/${sessionId}.json`;
  
  try {
    const dir = path.dirname(chatPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(chatPath, JSON.stringify({
      ...chatData,
      savedAt: timestamp
    }, null, 2));
    
    res.json({ success: true, message: 'Chat saved' });
  } catch (error) {
    console.error('Chat save error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Get user chat history
app.get('/api/chats/history/:username', (req, res) => {
  const { username } = req.params;
  const fs = require('fs');
  const path = require('path');
  
  const chatsDir = `./chats/${username}`;
  
  try {
    if (!fs.existsSync(chatsDir)) {
      return res.json({ chats: [] });
    }
    
    const files = fs.readdirSync(chatsDir);
    const chats = files.map(file => {
      const data = fs.readFileSync(path.join(chatsDir, file), 'utf8');
      return JSON.parse(data);
    });
    
    res.json({ chats: chats.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)) });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

*/

// Frontend API helper class
class BackendAPI {
  static baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  static async logChat(message, sender = 'user', chatId = null) {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      return fetch(`${this.baseURL}/api/logs/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username || 'anonymous',
          content: message,
          sender,
          chatId: chatId || 'default',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Backend API error:', error);
      throw error;
    }
  }

  static async saveChat(chatData) {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      return fetch(`${this.baseURL}/api/chats/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username || 'anonymous',
          chatData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Backend API error:', error);
      throw error;
    }
  }

  static async getChatHistory(username) {
    try {
      return fetch(`${this.baseURL}/api/chats/history/${username}`);
    } catch (error) {
      console.error('Backend API error:', error);
      throw error;
    }
  }
}
