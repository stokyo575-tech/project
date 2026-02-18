// ===== CHAT LOGGER SYSTEM =====
// Logs chats to user-specific savechat.log file

class ChatLogger {
  constructor() {
    this.currentUser = null;
    this.sessionId = Date.now().toString();
    this.initUser();
  }

  initUser() {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    } catch (e) {
      console.warn('Could not retrieve current user', e);
    }
  }

  // Format chat message
  formatMessage(message, sender = 'user') {
    return {
      timestamp: new Date().toISOString(),
      sender: sender, // 'user' or 'ai'
      content: message,
      user: this.currentUser?.username || 'anonymous'
    };
  }

  // Log to backend
  async logToBackend(message, sender = 'user') {
    try {
      const logData = this.formatMessage(message, sender);
      
      const response = await fetch('/api/logs/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...logData,
          sessionId: this.sessionId,
          chatId: window.currentChatId || 'default'
        })
      });

      if (!response.ok) {
        console.warn('Chat logging failed:', response.status);
      }
    } catch (error) {
      console.warn('Chat logger error (continuing anyway):', error);
      // Fallback to localStorage if backend fails
      this.logToLocalStorage(message, sender);
    }
  }

  // Fallback: log to localStorage
  logToLocalStorage(message, sender = 'user') {
    try {
      const logs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
      logs.push(this.formatMessage(message, sender));
      localStorage.setItem('chatLogs', JSON.stringify(logs));
    } catch (e) {
      console.warn('localStorage logging failed:', e);
    }
  }

  // Save chat session
  async saveChatSession(chatData) {
    try {
      const response = await fetch('/api/chats/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.currentUser?.username || 'anonymous',
          chatData: chatData,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.warn('Chat save failed:', response.status);
      }
    } catch (error) {
      console.warn('Chat save error:', error);
    }
  }
}

// Initialize logger
const chatLogger = new ChatLogger();
