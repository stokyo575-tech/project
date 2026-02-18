# 🎯 DEVELOPER CHEAT SHEET - WhiteGPT Qwen Update

## 🔄 File Structure

```
Frontend (Updated) ✅
├── index.html ★ Sidebar added
├── style.css ★ Flex layout changed
├── animations.css (unchanged)
├── chat-logger.js ★ NEW
├── sidebar.js ★ NEW  
├── sidebar.css ★ NEW
├── backend-handlers.js ★ NEW
├── main.js (needs minor updates)
├── auth-new.js (unchanged)
├── config.js (unchanged)
└── other files...

Backend (Template provided) ⏳
├── server.js (use SERVER_TEMPLATE.js)
├── .env (create manually)
├── logs/ (auto-created)
├── chats/ (auto-created)
└── package.json (npm init)
```

---

## 🛠️ API ENDPOINTS

### Log a Message
```
POST /api/logs/chat

Request:
{
  "username": "john",
  "content": "Hello AI",
  "sender": "user",  // atau "ai"
  "chatId": "123",
  "timestamp": "2025-02-19T10:00:00Z"
}

Response:
{ "success": true, "message": "Message logged successfully" }
```

### Save Chat Session
```
POST /api/chats/save

Request:
{
  "username": "john",
  "chatData": {
    "id": "123",
    "title": "Chat title",
    "messages": [...]
  },
  "timestamp": "2025-02-19T10:00:00Z"
}

Response:
{ "success": true, "sessionId": "123" }
```

### Get Chat History
```
GET /api/chats/history/:username

Response:
{
  "chats": [
    {
      "id": "123",
      "title": "Chat 1",
      "savedAt": "2025-02-19T10:00:00Z"
    },
    ...
  ]
}
```

### Get Logs
```
GET /api/logs/:username

Response:
{
  "logs": [
    {
      "timestamp": "2025-02-19T10:00:00Z",
      "sender": "user",
      "content": "Hello",
      "chatId": "123"
    },
    ...
  ]
}
```

---

## 🎨 CSS Classes Reference

### Sidebar Classes
```css
.sidebar                    /* Main sidebar container */
.sidebar.collapsed          /* Collapsed state */
.sidebar-header             /* Top section with logo */
.sidebar-brand              /* Brand text */
.toggle-btn                 /* Collapse/expand button */
.sidebar-content            /* Scrollable content area */
.new-chat-btn               /* New chat button */
.sidebar-section            /* Section container */
.sidebar-label              /* Section label */
.recent-chats-list          /* Chat list container */
.chat-item                  /* Individual chat item */
.chat-item.active           /* Active/selected chat */
.chat-item-content          /* Chat content wrapper */
.chat-title                 /* Chat title text */
.chat-date                  /* Chat date/time */
.chat-delete-btn            /* Delete button */
.sidebar-footer             /* Bottom section */
.user-menu-btn              /* User menu button */
.user-menu                  /* User menu popup */
.user-menu-item             /* Menu item */
.user-menu-divider          /* Menu separator */
```

### Layout Classes
```css
.main-container             /* Main content area */
header                      /* Header section */
#chat-window                /* Chat display area */
#input-area                 /* Input section */
.message-container          /* Message wrapper */
.message                    /* Message bubble */
.user-message               /* User message style */
.ai-message                 /* AI message style */
```

---

## 💻 JavaScript API Reference

### ChatLogger Class
```javascript
// Initialize (auto)
const logger = new ChatLogger();

// Log message to backend
logger.logToBackend(message, sender, chatId);
// sender: 'user' or 'ai'

// Save chat session
logger.saveChatSession(chatData);

// Fallback to localStorage
logger.logToLocalStorage(message, sender);
```

### SidebarController Class
```javascript
// Initialize (auto on DOMContentLoaded)
const sidebar = new SidebarController();

// Toggle sidebar
sidebar.toggleSidebar();

// Load current user
sidebar.loadCurrentUser();

// Load recent chats
sidebar.loadRecentChats();

// New chat handler
sidebar.handleNewChat();

// Delete chat
sidebar.deleteChat(chatId);

// Refresh chat list
sidebar.refreshChatList();
```

### BackendAPI Class
```javascript
// Log chat
BackendAPI.logChat(message, sender, chatId);

// Save chat
BackendAPI.saveChat(chatData);

// Get history
BackendAPI.getChatHistory(username);

// Set custom base URL
BackendAPI.baseURL = 'http://custom-api.com';
```

---

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5000
NODE_ENV=development
LOG_PATH=./logs
CHATS_PATH=./chats
```

### Frontend Config (config.js)
```javascript
window.CONFIG = {
    APP_NAME: 'WhiteGpt',
    MODEL_NAME: 'gemini-2.5-flash-preview-09-2025',
    MAX_TOKENS: 8192,
    API_KEYS: [...],
    SYSTEM_PROMPT: window.SYSTEM_PROMPT
};
```

### API Configuration (backend-handlers.js)
```javascript
BackendAPI.baseURL = 'http://localhost:3000';  // Development
// atau
BackendAPI.baseURL = 'https://api.yourdomain.com';  // Production
```

---

## 📊 Data Structures

### Chat Data Format
```javascript
{
  id: "1708263600000",
  title: "First message...",
  messages: [
    {
      role: "user",
      parts: [{ text: "Hello" }]
    },
    {
      role: "model",
      parts: [{ text: "Hi there!" }]
    }
  ],
  timestamp: "2025-02-19T10:00:00Z",
  username: "john"  // Added by backend
}
```

### Log Entry Format
```javascript
{
  timestamp: "2025-02-19T10:00:00Z",
  sender: "user",  // or "ai"
  content: "Full message content here",
  chatId: "123"
}
```

### User Object
```javascript
{
  username: "john",
  email: "john@example.com",
  role: "user",  // or "admin"
  createdAt: "2025-02-19T10:00:00Z"
}
```

---

## 🚀 Quick Commands

### Frontend
```bash
# Test locally
open index.html  # macOS
start index.html # Windows
firefox index.html # Linux

# Deploy to Vercel
vercel deploy
```

### Backend
```bash
# Install & setup
npm init -y
npm install express cors dotenv

# Run server
node server.js

# Test endpoint
curl http://localhost:3000/api/health

# Check logs
tail -f logs/username/savechat.log
```

### Docker (Optional)
```bash
# Build
docker build -t whitegpt-backend .

# Run
docker run -p 3000:3000 whitegpt-backend
```

---

## 🧪 Testing

### Postman Test Collection
```json
{
  "info": {
    "name": "WhiteGPT API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/health"
      }
    },
    {
      "name": "Log Chat",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/logs/chat",
        "body": {
          "username": "testuser",
          "content": "Test message",
          "sender": "user"
        }
      }
    }
  ]
}
```

### Manual Testing
```javascript
// Browser Console Test
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(d => console.log(d));

// Should output:
// {status: 'ok', timestamp: '...', uptime: ...}
```

---

## 🐛 Debugging

### Browser DevTools (F12)

**Console Tab:**
```javascript
// Check if libraries loaded
console.log(window.chatLogger);      // Should exist
console.log(window.sidebarController); // Should exist
console.log(window.BackendAPI);      // Should exist

// Check storage
localStorage.getItem('chatHistories');
localStorage.getItem('currentUser');

// Manual log test
window.chatLogger.logToBackend('test', 'user', 'test-id');
```

**Network Tab:**
- Look for `/api/logs/chat` POST requests
- Check response status (should be 200)
- View request/response payload

**Application Tab:**
- Check localStorage items
- Verify chatHistories array
- Check currentUser object

### Server Debug
```bash
# Enable debug logging
DEBUG=whitegpt:* node server.js

# Watch file changes
npm install -g nodemon
nodemon server.js

# Check file permissions
ls -la logs/
chmod 755 logs/
```

---

## 🔐 Security Checklist

- [ ] CORS properly configured
- [ ] Input validation on backend
- [ ] Filename sanitization
- [ ] User authentication verified
- [ ] File permissions set correctly
- [ ] No sensitive data in logs
- [ ] Rate limiting implemented
- [ ] Error messages don't leak info
- [ ] File access restricted to owner
- [ ] Regular backups scheduled

---

## 📈 Performance Tips

1. **Optimize Sidebar**
   - Load only last 10 chats initially
   - Lazy load older chats
   - Implement pagination if needed

2. **Optimize Logging**
   - Batch logs if high volume
   - Archive old logs periodically
   - Consider database for scale

3. **Optimize Frontend**
   - Lazy load sidebar.css
   - Debounce scroll events
   - Cache recent chats

4. **Optimize Backend**
   - Use streams for large files
   - Implement caching
   - Use clustering for multiple CPUs

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database backed up
- [ ] SSL certificate ready

### Deployment
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Backend deployed to Render/Railway
- [ ] DNS configured
- [ ] Environment variables updated
- [ ] Monitoring set up

### Post-deployment
- [ ] Health checks passing
- [ ] Logs being saved
- [ ] Users can login
- [ ] Chat history working
- [ ] No errors in production

---

## 📚 File Size Reference

| File | Size | Purpose |
|------|------|---------|
| chat-logger.js | 3 KB | Chat logging |
| sidebar.js | 9 KB | Sidebar logic |
| sidebar.css | 15 KB | Sidebar styling |
| backend-handlers.js | 6 KB | API helpers |
| SERVER_TEMPLATE.js | 12 KB | Backend template |
| TOTAL NEW | ~45 KB | All new files |

---

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Async/Await](https://javascript.info/async-await)
- [REST API Best Practices](https://restfulapi.net/)
- [Node.js File System](https://nodejs.org/api/fs.html)

---

## 💡 Pro Tips

1. **Use Postman** for API testing before integration
2. **Check browser console** first for client-side errors
3. **Check server console** for backend errors
4. **Use tail -f** to watch log files in real-time
5. **Version your APIs** to avoid breaking changes
6. **Document your endpoints** for future reference
7. **Use environment variables** for configuration
8. **Implement rate limiting** to prevent abuse

---

## ❓ Quick Troubleshooting

**Sidebar not showing?**
→ Check script includes, browser cache, console errors

**API 404?**
→ Check backend running, endpoint path, CORS

**Logs not saving?**
→ Check file permissions, folder exists, backend errors

**Frontend can't find backend?**
→ Check API URL, CORS configured, firewall

---

**Last Updated:** 2025-02-19  
**Quick Reference Version:** 1.0
