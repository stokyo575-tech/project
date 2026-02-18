// auth-new.js - Enhanced Authentication with User Registration and Login.log

// ========== USER MANAGER ==========
class UserManager {
  constructor() {
    this.users = [];
    this.loadUsers();
  }

  loadUsers() {
    const stored = localStorage.getItem('users');
    this.users = stored ? JSON.parse(stored) : this.getDefaultUsers();
  }

  getDefaultUsers() {
    return [
      { username: 'admin', password: 'admin123', role: 'admin', created: new Date().toISOString() },
      { username: 'user', password: 'user123', role: 'user', created: new Date().toISOString() }
    ];
  }

  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
    this.logToFile();
  }

  logToFile() {
    const logEntry = this.users.map(u => `${u.username}:${u.password}`).join('\n');
    const blob = new Blob([logEntry], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Auto-download Log (optional - mainly for backend)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('📝 Login.log - Users:', this.users);
    }
  }

  registerUser(username, password, email = '') {
    if (this.users.find(u => u.username === username)) {
      return { success: false, message: 'Username sudah terdaftar' };
    }
    
    if (username.length < 3) {
      return { success: false, message: 'Username minimal 3 karakter' };
    }
    
    if (password.length < 5) {
      return { success: false, message: 'Password minimal 5 karakter' };
    }

    const newUser = {
      username,
      password,
      email,
      role: 'user',
      created: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();

    return { success: true, message: 'Pendaftaran berhasil', user: newUser };
  }

  authenticateUser(username, password) {
    const user = this.users.find(u => u.username === username && u.password === password);
    return user || null;
  }
}

// Initialize User Manager globally
window.userManager = new UserManager();

// ========== AUTHENTICATION FUNCTIONS ==========
async function isAuthenticated() {
  return localStorage.getItem("authenticated") === "true";
}

async function authenticate(username, password) {
  try {
    const user = window.userManager.authenticateUser(username, password);
    
    if (!user) {
      return { success: false, message: 'Username atau password salah' };
    }

    // Set session
    RoleManager.setCurrentUser(user);
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));

    return { success: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Terjadi kesalahan saat login' };
  }
}

async function registerUser(username, password, email = '') {
  return window.userManager.registerUser(username, password, email);
}

function logout() {
  localStorage.removeItem('authenticated');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('chatHistories');
  RoleManager.logout();
}

function stayLoggedOut() {
  logout();
  localStorage.setItem('stayLoggedOut', 'true');
}

function protectPage() {
  if (!isAuthenticated() && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
  }
}

// Auto-protect pages
if (typeof window !== 'undefined') {
  protectPage();
}