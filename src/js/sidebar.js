// ===== SIDEBAR CONTROLLER =====
// Manages sidebar navigation, chat history, and user menu

class SidebarController {
  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.toggleBtn = document.getElementById('toggle-sidebar');
    this.newChatBtn = document.getElementById('new-chat-sidebar');
    this.recentChatsContainer = document.getElementById('recent-chats');
    this.userMenuBtn = document.getElementById('user-menu-btn');
    this.currentUserSpan = document.getElementById('current-user');
    
    this.isCollapsed = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadCurrentUser();
    this.loadRecentChats();
  }

  setupEventListeners() {
    // Toggle sidebar - full area click detection
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSidebar();
      });
    }

    // Also toggle on entire sidebar header for better UX
    if (this.sidebar) {
      const header = this.sidebar.querySelector('.sidebar-header');
      if (header) {
        // Only toggle on left edge or toggle button
        header.addEventListener('click', (e) => {
          if (e.target === this.toggleBtn || e.target.closest('.toggle-btn')) {
            e.stopPropagation();
            this.toggleSidebar();
          }
        });
      }
    }

    // New chat
    if (this.newChatBtn) {
      this.newChatBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleNewChat();
      });
    }

    // User menu
    if (this.userMenuBtn) {
      this.userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showUserMenu();
      });
    }

    // Close sidebar on mobile when clicking chat
    if (window.innerWidth < 768) {
      document.addEventListener('click', (e) => {
        // Don't close if clicking inside sidebar
        if (e.target.closest('#sidebar')) {
          return;
        }
        
        if (e.target.closest('#chat-window') || e.target.closest('#input-area')) {
          if (!this.isCollapsed) {
            this.toggleSidebar();
          }
        }
      });
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', this.isCollapsed);
  }

  loadCurrentUser() {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (this.currentUserSpan && user.username) {
        this.currentUserSpan.textContent = user.username.substring(0, 20);
      }
    } catch (e) {
      console.warn('Could not load user:', e);
    }
  }

  loadRecentChats() {
    try {
      const chatHistories = JSON.parse(localStorage.getItem('chatHistories') || '[]');
      this.recentChatsContainer.innerHTML = '';

      if (chatHistories.length === 0) {
        this.recentChatsContainer.innerHTML = '<div class="no-chats">No chats yet</div>';
        return;
      }

      // Show last 10 chats
      chatHistories.slice(0, 10).forEach((chat) => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.innerHTML = `
          <div class="chat-item-content">
            <span class="chat-title" title="${chat.title}">${this.truncateText(chat.title, 25)}</span>
            <span class="chat-date">${this.formatDate(chat.timestamp)}</span>
          </div>
          <button class="chat-delete-btn" data-chat-id="${chat.id}">
            <i class="fas fa-trash"></i>
          </button>
        `;

        chatItem.addEventListener('click', (e) => {
          if (!e.target.closest('.chat-delete-btn')) {
            this.selectChat(chat.id);
          }
        });

        const deleteBtn = chatItem.querySelector('.chat-delete-btn');
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteChat(chat.id);
        });

        this.recentChatsContainer.appendChild(chatItem);
      });
    } catch (e) {
      console.warn('Could not load recent chats:', e);
    }
  }

  handleNewChat() {
    // Trigger new chat in main.js
    if (window.newChatEvent) {
      window.newChatEvent();
    }
    
    // Scroll to top if sidebar open
    if (!this.isCollapsed) {
      this.recentChatsContainer.scrollTop = 0;
    }
  }

  selectChat(chatId) {
    // Find and load chat
    const chatHistories = JSON.parse(localStorage.getItem('chatHistories') || '[]');
    const chat = chatHistories.find(c => c.id === chatId);
    
    if (chat && window.loadChat) {
      window.loadChat(chatId);
      
      // Highlight selected chat
      document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
      });
      event.target.closest('.chat-item')?.classList.add('active');
    }
  }

  deleteChat(chatId) {
    if (!confirm('Delete this chat?')) return;

    let chatHistories = JSON.parse(localStorage.getItem('chatHistories') || '[]');
    chatHistories = chatHistories.filter(c => c.id !== chatId);
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));

    this.loadRecentChats();
  }

  showUserMenu() {
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
      <div class="user-menu-item">
        <i class="fas fa-user"></i>
        <span>Profile</span>
      </div>
      <div class="user-menu-item">
        <i class="fas fa-cog"></i>
        <span>Settings</span>
      </div>
      <div class="user-menu-divider"></div>
      <div class="user-menu-item" id="logout-menu">
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </div>
    `;

    // Remove existing menu if any
    document.querySelectorAll('.user-menu').forEach(m => m.remove());
    
    document.body.appendChild(menu);

    // Position menu near button
    const btnRect = this.userMenuBtn.getBoundingClientRect();
    menu.style.top = (btnRect.bottom + 5) + 'px';
    menu.style.left = (btnRect.left - 150) + 'px';

    // Logout handler
    menu.querySelector('#logout-menu')?.addEventListener('click', () => {
      RoleManager.logout();
      window.location.href = 'login.html';
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu') && !e.target.closest('.user-menu-btn')) {
        menu.remove();
      }
    }, { once: true });
  }

  truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    }
  }

  refreshChatList() {
    this.loadRecentChats();
  }
}

// Initialize sidebar when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.sidebarController = new SidebarController();
});
