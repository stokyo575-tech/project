// admin.js - Admin Panel Logic

let currentEditUserId = null;
let currentDeleteUserId = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is admin
  const currentUser = RoleManager.getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    alert('Access denied! Admin only.');
    window.location.href = 'index.html';
    return;
  }
  
  // Load users
  await loadUsers();
  
  // Setup event listeners
  setupEventListeners();
});

// ========== LOAD USERS ==========
async function loadUsers() {
  try {
    const users = await window.userManager.loadUsers();
    renderUsers(users);
    updateStats(users);
  } catch (error) {
    console.error('Error loading users:', error);
    showToast('Gagal memuat data users', 'error');
  }
}

// ========== RENDER USERS TABLE ==========
function renderUsers(users) {
  const tbody = document.getElementById('users-tbody');
  
  if (users.length === 0) {
    tbody.innerHTML = `
      <tr class="loading-row">
        <td colspan="6">
          <div class="loading-spinner">
            <i class="fas fa-inbox"></i>
            <span>Belum ada user</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = users.map(user => {
    const status = getUserStatus(user);
    const statusClass = status === 'Active' ? 'active' : status === 'Expired' ? 'expired' : 'expiring';
    const createdDate = new Date(user.createdAt).toLocaleDateString('id-ID');
    const expiryDate = user.expiryDate ? new Date(user.expiryDate).toLocaleDateString('id-ID') : 'Tidak ada';
    
    return `
      <tr>
        <td><strong>${user.username}</strong></td>
        <td>
          <span class="role-badge ${user.role}">${user.role}</span>
        </td>
        <td>${createdDate}</td>
        <td>${expiryDate}</td>
        <td>
          <span class="status-badge ${statusClass}">${status}</span>
        </td>
        <td>
          <div class="action-btns">
            <button class="action-btn edit-btn" onclick="editUser('${user.id}')">
              <i class="fas fa-edit"></i>
              <span>Edit</span>
            </button>
            <button class="action-btn delete-btn" onclick="deleteUser('${user.id}')">
              <i class="fas fa-trash"></i>
              <span>Hapus</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ========== GET USER STATUS ==========
function getUserStatus(user) {
  if (!user.isActive) return 'Inactive';
  
  if (user.expiryDate) {
    const expiry = new Date(user.expiryDate);
    const now = new Date();
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'Expired';
    if (daysLeft <= 7) return 'Expiring Soon';
  }
  
  return 'Active';
}

// ========== UPDATE STATS ==========
function updateStats(users) {
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  
  let expiringSoon = 0;
  let expired = 0;
  
  users.forEach(user => {
    if (user.expiryDate) {
      const expiry = new Date(user.expiryDate);
      const now = new Date();
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      
      if (daysLeft < 0) expired++;
      else if (daysLeft <= 7) expiringSoon++;
    }
  });
  
  document.getElementById('total-users').textContent = totalUsers;
  document.getElementById('total-admins').textContent = totalAdmins;
  document.getElementById('expiring-soon').textContent = expiringSoon;
  document.getElementById('expired-users').textContent = expired;
}

// ========== SETUP EVENT LISTENERS ==========
function setupEventListeners() {
  // Add user button
  document.getElementById('add-user-btn').addEventListener('click', () => {
    currentEditUserId = null;
    openUserModal();
  });
  
  // Refresh button
  document.getElementById('refresh-btn').addEventListener('click', async () => {
    const btn = document.getElementById('refresh-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Refreshing...</span>';
    await loadUsers();
    btn.innerHTML = '<i class="fas fa-sync-alt"></i><span>Refresh Data</span>';
    showToast('Data berhasil direfresh');
  });
  
  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const users = window.userManager.getAllUsers();
    const filtered = users.filter(u => 
      u.username.toLowerCase().includes(searchTerm) ||
      u.role.toLowerCase().includes(searchTerm)
    );
    renderUsers(filtered);
  });
  
  // Modal close buttons
  document.getElementById('close-modal').addEventListener('click', closeUserModal);
  document.getElementById('cancel-btn').addEventListener('click', closeUserModal);
  document.getElementById('close-delete-modal').addEventListener('click', closeDeleteModal);
  document.getElementById('cancel-delete-btn').addEventListener('click', closeDeleteModal);
  
  // Form submit
  document.getElementById('user-form').addEventListener('submit', handleFormSubmit);
  
  // Delete confirm
  document.getElementById('confirm-delete-btn').addEventListener('click', handleDeleteConfirm);
  
  // Logout
  document.getElementById('logout-btn-admin').addEventListener('click', () => {
    if (confirm('Yakin ingin logout?')) {
      RoleManager.logout();
    }
  });
  
  // Close modal on outside click
  document.getElementById('user-modal').addEventListener('click', (e) => {
    if (e.target.id === 'user-modal') closeUserModal();
  });
  
  document.getElementById('delete-modal').addEventListener('click', (e) => {
    if (e.target.id === 'delete-modal') closeDeleteModal();
  });
}

// ========== MODAL FUNCTIONS ==========
function openUserModal(userId = null) {
  const modal = document.getElementById('user-modal');
  const form = document.getElementById('user-form');
  const title = document.getElementById('modal-title');
  
  form.reset();
  
  if (userId) {
    // Edit mode
    currentEditUserId = userId;
    const user = window.userManager.getUserById(userId);
    
    title.textContent = 'Edit User';
    document.getElementById('username').value = user.username;
    document.getElementById('password').value = user.password;
    document.getElementById('role').value = user.role;
    document.getElementById('is-active').checked = user.isActive;
    
    if (user.expiryDate) {
      const date = new Date(user.expiryDate);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      document.getElementById('expiry-date').value = localDate.toISOString().slice(0, 16);
    }
  } else {
    // Add mode
    title.textContent = 'Tambah User Baru';
    document.getElementById('is-active').checked = true;
  }
  
  modal.classList.add('active');
}

function closeUserModal() {
  document.getElementById('user-modal').classList.remove('active');
  currentEditUserId = null;
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.remove('active');
  currentDeleteUserId = null;
}

// ========== FORM SUBMIT ==========
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const userData = {
    username: document.getElementById('username').value.trim(),
    password: document.getElementById('password').value.trim(),
    role: document.getElementById('role').value,
    isActive: document.getElementById('is-active').checked,
    expiryDate: document.getElementById('expiry-date').value || null
  };
  
  try {
    if (currentEditUserId) {
      // Update existing user
      window.userManager.updateUser(currentEditUserId, userData);
      showToast('User berhasil diupdate');
    } else {
      // Add new user
      window.userManager.addUser(userData);
      showToast('User berhasil ditambahkan');
    }
    
    await window.userManager.saveUsers();
    await loadUsers();
    closeUserModal();
  } catch (error) {
    console.error('Error saving user:', error);
    showToast(error.message || 'Gagal menyimpan user', 'error');
  }
}

// ========== EDIT USER ==========
window.editUser = function(userId) {
  openUserModal(userId);
};

// ========== DELETE USER ==========
window.deleteUser = function(userId) {
  const user = window.userManager.getUserById(userId);
  currentDeleteUserId = userId;
  
  document.getElementById('delete-username').textContent = user.username;
  document.getElementById('delete-modal').classList.add('active');
};

async function handleDeleteConfirm() {
  if (!currentDeleteUserId) return;
  
  try {
    window.userManager.deleteUser(currentDeleteUserId);
    await window.userManager.saveUsers();
    await loadUsers();
    closeDeleteModal();
    showToast('User berhasil dihapus');
  } catch (error) {
    console.error('Error deleting user:', error);
    showToast('Gagal menghapus user', 'error');
  }
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const icon = toast.querySelector('i');
  
  toastMessage.textContent = message;
  
  if (type === 'error') {
    toast.classList.add('error');
    icon.className = 'fas fa-exclamation-circle';
  } else {
    toast.classList.remove('error');
    icon.className = 'fas fa-check-circle';
  }
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}