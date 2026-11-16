const API_BASE_URL = window.location.protocol.startsWith('http')
  ? `${window.location.origin}/api`
  : 'http://127.0.0.1:5000/api';

// Global state
let currentUser = null;
let currentToken = localStorage.getItem('jules_auth_token') || null;
let menuItems = [];
let orders = [];
let usersList = [];
let activeOrderFilter = 'all';
let clockInterval = null;

// DOM Elements
const loginSection = document.getElementById('login-section');
const portalDashboard = document.getElementById('portal-dashboard');
const headerUserInfo = document.getElementById('header-user-info');
const userDisplayName = document.getElementById('user-display-name');
const userDisplayRole = document.getElementById('user-display-role');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  checkAuthSession();
  startLiveClock();
});

// HTML sanitizer helper
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper for API Headers
function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (currentToken) {
    headers['X-Auth-Token'] = currentToken;
  }
  return headers;
}

// Toast notification helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Live Clock on Dashboard
function startLiveClock() {
  const clockEl = document.getElementById('live-clock');
  const update = () => {
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  update();
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(update, 1000);
}

// Initialize event listeners
function initEventListeners() {
  // Quick demo logins
  document.querySelectorAll('.btn-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      const u = btn.getAttribute('data-user');
      const p = btn.getAttribute('data-pass');
      document.getElementById('login-username').value = u;
      document.getElementById('login-password').value = p;
      handleLogin(u, p);
    });
  });

  // Login form submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('login-username').value.trim();
      const p = document.getElementById('login-password').value.trim();
      handleLogin(u, p);
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Navigation Tabs Switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Quick Action Buttons on Dashboard
  const btnDashRefresh = document.getElementById('btn-dash-refresh');
  if (btnDashRefresh) {
    btnDashRefresh.addEventListener('click', () => {
      fetchAnalytics();
      fetchOrders();
      fetchMenu();
      if (currentUser && currentUser.role === 'admin') fetchUsers();
      showToast('Live dashboard data updated', 'success');
    });
  }

  const btnQuickAddMenu = document.getElementById('btn-quick-add-menu');
  if (btnQuickAddMenu) {
    btnQuickAddMenu.addEventListener('click', () => openMenuModal('create'));
  }

  // Walk-In Order Modals & Triggers
  const btnQuickWalkin = document.getElementById('btn-quick-walkin');
  if (btnQuickWalkin) btnQuickWalkin.addEventListener('click', openWalkinModal);

  const btnOrdersWalkin = document.getElementById('btn-orders-walkin');
  if (btnOrdersWalkin) btnOrdersWalkin.addEventListener('click', openWalkinModal);

  const closeWalkinBtn = document.getElementById('close-walkin-modal-btn');
  if (closeWalkinBtn) closeWalkinBtn.addEventListener('click', closeWalkinModal);
  const cancelWalkinBtn = document.getElementById('cancel-walkin-modal-btn');
  if (cancelWalkinBtn) cancelWalkinBtn.addEventListener('click', closeWalkinModal);

  const walkinForm = document.getElementById('walkin-form');
  if (walkinForm) walkinForm.addEventListener('submit', handleWalkinSubmit);

  const walkinPaySelect = document.getElementById('walkin-payment-method');
  const walkinRefInput = document.getElementById('walkin-payment-ref');
  if (walkinRefInput) {
    walkinRefInput.setAttribute('maxlength', '13');
    walkinRefInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 13);
    });
  }
  if (walkinPaySelect) {
    walkinPaySelect.addEventListener('change', (e) => {
      const refWrap = document.getElementById('walkin-ref-wrap');
      if (refWrap) refWrap.style.display = e.target.value === 'GCash' ? 'block' : 'none';
    });
  }

  // Receipt Modal Controls
  const closeReceiptBtn = document.getElementById('close-receipt-modal-btn');
  if (closeReceiptBtn) closeReceiptBtn.addEventListener('click', closeReceiptModal);
  const cancelReceiptBtn = document.getElementById('cancel-receipt-modal-btn');
  if (cancelReceiptBtn) cancelReceiptBtn.addEventListener('click', closeReceiptModal);

  // Orders Filter Status Pills
  document.querySelectorAll('.status-pills-filter .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.status-pills-filter .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeOrderFilter = pill.getAttribute('data-status');
      renderOrdersList();
    });
  });

  // Orders Search & Refresh
  const ordersSearch = document.getElementById('orders-search-input');
  if (ordersSearch) ordersSearch.addEventListener('input', renderOrdersList);

  const refreshOrdersBtn = document.getElementById('refresh-orders-btn');
  if (refreshOrdersBtn) refreshOrdersBtn.addEventListener('click', () => {
    fetchOrders();
    fetchAnalytics();
    showToast('Orders refreshed', 'info');
  });

  // Menu Search & Category Filter
  const menuSearch = document.getElementById('menu-search-input');
  if (menuSearch) menuSearch.addEventListener('input', renderMenuTable);

  const menuCategoryFilter = document.getElementById('menu-category-filter');
  if (menuCategoryFilter) menuCategoryFilter.addEventListener('change', renderMenuTable);

  // Menu Modal controls
  const openAddMenuBtn = document.getElementById('open-add-menu-modal-btn');
  if (openAddMenuBtn) openAddMenuBtn.addEventListener('click', () => openMenuModal('create'));

  const closeMenuModalBtn = document.getElementById('close-menu-modal-btn');
  if (closeMenuModalBtn) closeMenuModalBtn.addEventListener('click', closeMenuModal);
  const cancelMenuModalBtn = document.getElementById('cancel-menu-modal-btn');
  if (cancelMenuModalBtn) cancelMenuModalBtn.addEventListener('click', closeMenuModal);

  const menuForm = document.getElementById('menu-form');
  if (menuForm) menuForm.addEventListener('submit', handleMenuFormSubmit);

  // CSV Export Buttons
  document.getElementById('btn-export-csv-overview')?.addEventListener('click', handleExportCSV);
  document.getElementById('btn-export-csv-orders')?.addEventListener('click', handleExportCSV);

  // User Modal controls
  const openAddUserBtn = document.getElementById('open-add-user-modal-btn');
  if (openAddUserBtn) openAddUserBtn.addEventListener('click', () => openUserModal('create'));

  const closeUserModalBtn = document.getElementById('close-user-modal-btn');
  if (closeUserModalBtn) closeUserModalBtn.addEventListener('click', closeUserModal);
  const cancelUserModalBtn = document.getElementById('cancel-user-modal-btn');
  if (cancelUserModalBtn) cancelUserModalBtn.addEventListener('click', closeUserModal);

  const userForm = document.getElementById('user-form');
  if (userForm) userForm.addEventListener('submit', handleUserFormSubmit);
}

// Check session status on page load
async function checkAuthSession() {
  if (!currentToken) {
    showLoginScreen();
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (res.ok && data.authenticated) {
      currentUser = data.user;
      if (currentUser.role === 'customer') {
        showCustomerBlockedScreen();
        return;
      }
      showAuthenticatedPortal();
    } else {
      handleLogout();
    }
  } catch (err) {
    console.error("Auth check failed:", err);
    showLoginScreen();
  }
}

// Login Handler
async function handleLogin(username, password) {
  loginError.style.display = 'none';
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (res.ok && data.success) {
      currentUser = data.user;
      if (currentUser.role === 'customer') {
        showCustomerBlockedScreen();
        return;
      }
      currentToken = data.token;
      localStorage.setItem('jules_auth_token', currentToken);
      showToast(`Welcome back, ${currentUser.full_name}!`, 'success');
      showAuthenticatedPortal();
    } else {
      loginError.textContent = data.error || 'Invalid credentials.';
      loginError.style.display = 'block';
    }
  } catch (err) {
    loginError.textContent = 'Server communication error. Make sure app.py is running.';
    loginError.style.display = 'block';
  }
}

// Logout Handler
async function handleLogout() {
  if (currentToken) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (e) {}
  }
  currentToken = null;
  currentUser = null;
  localStorage.removeItem('jules_auth_token');
  showLoginScreen();
  showToast('Logged out successfully', 'info');
}

// Show/Hide UI Views
function showLoginScreen() {
  loginSection.style.display = 'flex';
  portalDashboard.style.display = 'none';
  headerUserInfo.style.display = 'none';

  const staffCard = document.getElementById('staff-login-card');
  const blockedCard = document.getElementById('customer-blocked-card');
  if (staffCard) staffCard.style.display = 'block';
  if (blockedCard) blockedCard.style.display = 'none';
}

function showCustomerBlockedScreen() {
  loginSection.style.display = 'flex';
  portalDashboard.style.display = 'none';
  headerUserInfo.style.display = 'none';

  const staffCard = document.getElementById('staff-login-card');
  const blockedCard = document.getElementById('customer-blocked-card');
  if (staffCard) staffCard.style.display = 'none';
  if (blockedCard) blockedCard.style.display = 'block';

  const nameEl = document.getElementById('blocked-user-name');
  if (nameEl) {
    nameEl.textContent = currentUser ? currentUser.full_name : 'Customer';
  }
}

function showAuthenticatedPortal() {
  if (!currentUser || currentUser.role === 'customer') {
    showCustomerBlockedScreen();
    return;
  }

  loginSection.style.display = 'none';
  portalDashboard.style.display = 'block';
  headerUserInfo.style.display = 'flex';

  userDisplayName.textContent = currentUser.full_name;
  userDisplayRole.textContent = currentUser.role.toUpperCase();
  userDisplayRole.className = `user-role-pill role-${currentUser.role}`;

  const greetingName = document.getElementById('dash-greeting-name');
  if (greetingName) greetingName.textContent = currentUser.full_name;

  // Role visibility gating for Admin Tab button & Staff metric
  const adminTabBtn = document.getElementById('tab-nav-users');
  const staffMetricCard = document.getElementById('metric-card-staff');

  if (currentUser.role === 'admin') {
    if (adminTabBtn) adminTabBtn.style.display = 'flex';
    if (staffMetricCard) staffMetricCard.style.display = 'flex';
    fetchUsers();
  } else {
    if (adminTabBtn) adminTabBtn.style.display = 'none';
    if (staffMetricCard) staffMetricCard.style.display = 'none';
  }

  // Fetch all necessary data
  fetchAnalytics();
  fetchVisualSalesChart();
  fetchOrders();
  fetchMenu();

  // Header Button listeners
  const btnKdsHeader = document.getElementById('btn-open-kds-header');
  if (btnKdsHeader) {
    btnKdsHeader.onclick = openKdsModal;
  }

  const btnStaffChat = document.getElementById('btn-open-staff-chat');
  if (btnStaffChat) {
    btnStaffChat.onclick = openStaffChatModal;
  }

  loadStaffChatConversations();

  // Set up live auto-polling every 8 seconds for real-time kitchen & chat notifications
  if (adminPollInterval) clearInterval(adminPollInterval);
  adminPollInterval = setInterval(() => {
    if (currentToken) {
      fetchOrders();
      fetchAnalytics();
      loadStaffChatConversations();
    }
  }, 8000);

  // Default to Dashboard tab
  switchTab('tab-overview');
}

// Tab Switching (Strictly separate display)
function switchTab(tabId) {
  // If non-admin tries to open users tab, redirect to overview
  if (tabId === 'tab-users' && currentUser && currentUser.role !== 'admin') {
    tabId = 'tab-overview';
  }

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  const activeContent = document.getElementById(tabId);

  if (activeBtn) activeBtn.classList.add('active');
  if (activeContent) activeContent.classList.add('active');
}

// ==========================================
// DATA FETCHING & RENDERING
// ==========================================

// Analytics
async function fetchAnalytics() {
  if (!currentToken) return;
  try {
    const res = await fetch(`${API_BASE_URL}/analytics`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      
      // Update Stat Cards
      document.getElementById('stat-sales').textContent = `₱${parseFloat(data.totalSales || 0).toFixed(2)}`;
      document.getElementById('stat-avg-ticket').textContent = `₱${parseFloat(data.avgOrderValue || 0).toFixed(2)}`;
      document.getElementById('stat-total-orders').textContent = data.totalOrders || 0;
      document.getElementById('stat-completed-orders').textContent = data.completedOrders || 0;
      document.getElementById('stat-pending').textContent = data.pendingOrders || 0;
      document.getElementById('stat-menu-count').textContent = data.menuCount || 0;
      document.getElementById('stat-users-count').textContent = data.staffCount || 0;

      // Pending badge counts
      const pendingCount = data.pendingOrders || 0;
      document.getElementById('pending-orders-count').textContent = pendingCount;
      const dashQueueBadge = document.getElementById('dash-queue-badge');
      if (dashQueueBadge) dashQueueBadge.textContent = pendingCount;

      // Fulfillment calculations
      const pickup = (data.fulfillment && data.fulfillment.pickup) || 0;
      const delivery = (data.fulfillment && data.fulfillment.delivery) || 0;
      const totalFulfilled = pickup + delivery;
      const pickupPct = totalFulfilled > 0 ? Math.round((pickup / totalFulfilled) * 100) : 0;
      
      document.getElementById('stat-fulfillment-ratio').textContent = `${pickupPct}% Store`;
      document.getElementById('stat-pickup-count').textContent = `${pickup}`;
      document.getElementById('stat-delivery-count').textContent = `${delivery}`;

      // Render Top Selling Bestsellers Leaderboard
      renderBestsellers(data.topSelling || []);

      // Dynamic Category Popularity Breakdown
      if (data.categoryPopularity) {
        const pop = data.categoryPopularity;
        const espPct = pop.espresso || 0;
        const milkPct = pop.milk || 0;
        const frappePct = pop.frappe || 0;
        const bitesPct = pop.quickbites || 0;

        const espEl = document.getElementById('cat-stat-espresso-pct');
        const espBar = document.getElementById('cat-bar-espresso');
        if (espEl) espEl.textContent = `${espPct}%`;
        if (espBar) espBar.style.width = `${espPct}%`;

        const milkEl = document.getElementById('cat-stat-milk-pct');
        const milkBar = document.getElementById('cat-bar-milk');
        if (milkEl) milkEl.textContent = `${milkPct}%`;
        if (milkBar) milkBar.style.width = `${milkPct}%`;

        const frappeEl = document.getElementById('cat-stat-frappe-pct');
        const frappeBar = document.getElementById('cat-bar-frappe');
        if (frappeEl) frappeEl.textContent = `${frappePct}%`;
        if (frappeBar) frappeBar.style.width = `${frappePct}%`;

        const bitesEl = document.getElementById('cat-stat-bites-pct');
        const bitesBar = document.getElementById('cat-bar-bites');
        if (bitesEl) bitesEl.textContent = `${bitesPct}%`;
        if (bitesBar) bitesBar.style.width = `${bitesPct}%`;
      }
    }
  } catch (err) {
    console.error("Error fetching analytics:", err);
  }
}

// Bestsellers Leaderboard
function renderBestsellers(topItems) {
  const container = document.getElementById('bestsellers-container');
  if (!container) return;

  if (!topItems || topItems.length === 0) {
    container.innerHTML = `
      <div class="bestseller-item">
        <div class="bestseller-left">
          <span class="bestseller-rank">🥇</span>
          <div class="bestseller-details">
            <strong>Spanish Latte</strong>
            <span class="bestseller-cat">Espresso-Based • House Favorite</span>
          </div>
        </div>
        <div class="bestseller-stats">
          <div class="bestseller-qty">Top Seller</div>
          <div class="bestseller-rev">₱125.00 Base</div>
        </div>
      </div>
      <div class="bestseller-item">
        <div class="bestseller-left">
          <span class="bestseller-rank">🥈</span>
          <div class="bestseller-details">
            <strong>Biscoff Latte</strong>
            <span class="bestseller-cat">Espresso-Based • Cookie Butter</span>
          </div>
        </div>
        <div class="bestseller-stats">
          <div class="bestseller-qty">Top Seller</div>
          <div class="bestseller-rev">₱145.00 Base</div>
        </div>
      </div>
      <div class="bestseller-item">
        <div class="bestseller-left">
          <span class="bestseller-rank">🥉</span>
          <div class="bestseller-details">
            <strong>Creamy Carbonara</strong>
            <span class="bestseller-cat">Quick Bites • Fresh Pasta</span>
          </div>
        </div>
        <div class="bestseller-stats">
          <div class="bestseller-qty">Top Seller</div>
          <div class="bestseller-rev">₱135.00 Base</div>
        </div>
      </div>
    `;
    return;
  }

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  container.innerHTML = topItems.map((item, idx) => `
    <div class="bestseller-item">
      <div class="bestseller-left">
        <span class="bestseller-rank">${medals[idx] || (idx + 1)}</span>
        <div class="bestseller-details">
          <strong>${item.name}</strong>
          <span class="bestseller-cat">Top Sold Item</span>
        </div>
      </div>
      <div class="bestseller-stats">
        <div class="bestseller-qty">${item.qty} ordered</div>
        <div class="bestseller-rev">₱${parseFloat(item.revenue).toFixed(2)} sales</div>
      </div>
    </div>
  `).join('');
}

// Sound notification & export helper
let previousOrderIds = new Set();
let adminPollInterval = null;

function playKitchenOrderChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (e) {
    console.log("Chime notification notice:", e);
  }
}

function handleExportCSV() {
  if (!currentToken) {
    showToast('Please log in to export orders CSV.', 'error');
    return;
  }
  showToast('Preparing orders CSV export...', 'info');
  fetch(`${API_BASE_URL}/admin/export-orders`, { headers: getAuthHeaders() })
    .then(response => {
      if (!response.ok) throw new Error('Export failed');
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jules_cafe_orders_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('CSV Report downloaded successfully!', 'success');
    })
    .catch(err => {
      showToast('Failed to export CSV. Please try again.', 'error');
    });
}

// Orders CRUD Logic
async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() });
    if (res.ok) {
      const newOrders = await res.json();
      
      // Check if new orders arrived to trigger audio chime
      if (previousOrderIds.size > 0) {
        const newlyArrived = newOrders.filter(o => !previousOrderIds.has(o.id));
        if (newlyArrived.length > 0) {
          playKitchenOrderChime();
          showToast(`🛎️ ${newlyArrived.length} NEW order(s) arrived!`, 'success');
        }
      }

      previousOrderIds = new Set(newOrders.map(o => o.id));
      orders = newOrders;

      renderOrdersList();
      renderRecentOrdersPreview();
      
      const pendingCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
      document.getElementById('pending-orders-count').textContent = pendingCount;
      const dashQueueBadge = document.getElementById('dash-queue-badge');
      if (dashQueueBadge) dashQueueBadge.textContent = pendingCount;
    } else if (res.status === 401) {
      showToast('Staff session expired. Please sign in again.', 'error');
      handleLogout();
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
}

function renderOrdersList() {
  const container = document.getElementById('orders-container');
  if (!container) return;

  const searchQuery = (document.getElementById('orders-search-input')?.value || '').toLowerCase();

  let filtered = orders.filter(o => {
    const matchStatus = (activeOrderFilter === 'all') || (o.status === activeOrderFilter);
    const matchSearch = o.customer_name.toLowerCase().includes(searchQuery) ||
                        String(o.id).includes(searchQuery) ||
                        (o.contact_info && o.contact_info.toLowerCase().includes(searchQuery));
    return matchStatus && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p class="empty-state">No orders found matching status "${activeOrderFilter}".</p>`;
    return;
  }

  container.innerHTML = filtered.map(order => buildOrderCardHTML(order)).join('');
}

function renderRecentOrdersPreview() {
  const container = document.getElementById('recent-orders-preview');
  if (!container) return;

  const activeQueue = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').slice(0, 4);
  const toDisplay = activeQueue.length > 0 ? activeQueue : orders.slice(0, 4);

  if (toDisplay.length === 0) {
    container.innerHTML = `<p class="empty-state">No order activity recorded yet.</p>`;
    return;
  }
  container.innerHTML = toDisplay.map(order => buildOrderCardHTML(order)).join('');
}

function parseIsoDate(dateStr) {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'string' && dateStr.includes(' ') && !dateStr.includes('T')) {
    dateStr = dateStr.replace(' ', 'T') + 'Z';
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

function buildOrderCardHTML(order) {
  const isDelivery = (order.fulfillment_mode || '').toLowerCase() === 'delivery';
  const statusClass = `status-${(order.status || 'Pending').toLowerCase()}`;
  const formattedDate = parseIsoDate(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  let nextStatusBtnHTML = '';
  if (order.status === 'Pending') {
    nextStatusBtnHTML = `<button class="btn-status-next" onclick="updateOrderStatus(${order.id}, 'Preparing')"><i class="fa-solid fa-fire"></i> Mark Preparing</button>`;
  } else if (order.status === 'Preparing') {
    nextStatusBtnHTML = `<button class="btn-status-next" onclick="updateOrderStatus(${order.id}, 'Ready')"><i class="fa-solid fa-bell"></i> Mark Ready</button>`;
  } else if (order.status === 'Ready') {
    nextStatusBtnHTML = `<button class="btn-status-next" onclick="updateOrderStatus(${order.id}, 'Completed')"><i class="fa-solid fa-check"></i> Mark Completed</button>`;
  }

  // Google Maps navigation link for Delivery Orders
  let gmapsBtnHTML = '';
  if (isDelivery) {
    let gmapsUrl = order.delivery_maps_url;
    if (!gmapsUrl && order.delivery_lat && order.delivery_lng) {
      gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=7.1420,125.6265&destination=${order.delivery_lat},${order.delivery_lng}`;
    } else if (!gmapsUrl) {
      gmapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(order.delivery_address || order.contact_info || 'Davao City')}`;
    }
    gmapsBtnHTML = `<a href="${gmapsUrl}" target="_blank" class="btn-order-maps" title="Open Turn-by-Turn Rider Navigation in Google Maps"><i class="fa-solid fa-map-location-dot"></i> Google Maps</a>`;
  }

  let receiptBtnHTML = `<button class="btn-order-receipt" onclick="openReceiptModal(${order.id})" title="Print Official POS Receipt"><i class="fa-solid fa-receipt"></i> Receipt</button>`;

  let cancelBtnHTML = '';
  if (order.status !== 'Completed' && order.status !== 'Cancelled') {
    cancelBtnHTML = `<button class="btn-status-cancel" onclick="updateOrderStatus(${order.id}, 'Cancelled')">Cancel</button>`;
  }

  let deleteBtnHTML = '';
  if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff')) {
    deleteBtnHTML = `<button class="btn-order-delete" onclick="deleteOrder(${order.id})" title="Delete Order Record"><i class="fa-solid fa-trash"></i></button>`;
  }

  const itemsHTML = (order.items || []).map(item => `
    <div class="order-item-row">
      <div>
        <strong>${item.quantity}x ${item.item_name}</strong>
        ${item.custom_options ? `<span class="order-item-desc">${item.custom_options}</span>` : ''}
      </div>
      <div>₱${(item.unit_price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');

  const deliveryBoxHTML = isDelivery ? `
    <div class="order-delivery-box">
      <div class="delivery-box-title">
        <i class="fa-solid fa-truck-fast"></i> <strong>DELIVERY DESTINATION:</strong>
      </div>
      <div class="delivery-box-address">${escapeHtml(order.delivery_address || 'Customer Pinned Location')}</div>
      ${order.delivery_notes ? `<div class="delivery-box-notes"><i class="fa-solid fa-circle-info"></i> ${escapeHtml(order.delivery_notes)}</div>` : ''}
    </div>
  ` : '';

  // Payment Details Section
  const isGcash = (order.payment_method || '').toLowerCase() === 'gcash';
  const payStatus = order.payment_status || (isGcash ? 'Pending Verification' : 'Pending');
  const isPaid = payStatus.toLowerCase().includes('paid') || payStatus.toLowerCase().includes('verified');

  let paymentBoxHTML = '';
  if (isGcash) {
    paymentBoxHTML = `
      <div class="order-payment-box gcash-pay-box">
        <div class="payment-box-top">
          <span class="pay-method-badge gcash"><i class="fa-solid fa-mobile-screen"></i> GCash Express</span>
          <span class="pay-status-badge ${isPaid ? 'status-paid' : 'status-unverified'}">
            <i class="fa-solid ${isPaid ? 'fa-circle-check' : 'fa-clock'}"></i> ${escapeHtml(payStatus)}
          </span>
        </div>
        <div class="pay-ref-row">
          <span class="pay-ref-lbl">Ref No:</span>
          <strong class="pay-ref-num">${escapeHtml(order.payment_reference || 'None')}</strong>
          ${order.payment_receipt ? `<button type="button" class="btn-view-receipt-thumb" onclick="openReceiptImgModal(${order.id})" title="View Customer Receipt"><i class="fa-solid fa-image"></i> Receipt</button>` : ''}
        </div>
      </div>
    `;
  } else {
    paymentBoxHTML = `
      <div class="order-payment-box cash-pay-box">
        <div class="payment-box-top">
          <span class="pay-method-badge cash"><i class="fa-solid fa-money-bill-wave"></i> Cash</span>
          <span class="pay-status-badge ${isPaid ? 'status-paid' : 'status-cash-due'}">
            <i class="fa-solid ${isPaid ? 'fa-circle-check' : 'fa-hand-holding-dollar'}"></i> ${escapeHtml(payStatus)}
          </span>
        </div>
      </div>
    `;
  }

  let verifyPayBtnHTML = '';
  if (!isPaid) {
    verifyPayBtnHTML = `<button class="btn-verify-pay" onclick="toggleOrderPayment(${order.id}, 'Verified / Paid')" title="Verify customer payment"><i class="fa-solid fa-check"></i> Verify Pay</button>`;
  } else {
    verifyPayBtnHTML = `<button class="btn-verified-pay" onclick="toggleOrderPayment(${order.id}, 'Pending Verification')" title="Click to undo verified status"><i class="fa-solid fa-circle-check"></i> Paid ✓</button>`;
  }

  return `
    <div class="order-card ${isDelivery ? 'is-delivery-order' : ''}">
      <div class="order-card-header">
        <div>
          <span class="order-id-tag">Order #${order.id}</span>
          <span class="order-time"> • ${formattedDate}</span>
          ${isDelivery ? `<span class="badge-delivery-tag"><i class="fa-solid fa-motorcycle"></i> DELIVERY</span>` : `<span class="badge-pickup-tag"><i class="fa-solid fa-store"></i> PICKUP</span>`}
        </div>
        <span class="order-status-badge ${statusClass}">${order.status || 'Pending'}</span>
      </div>

      <div class="order-customer-info">
        <div class="customer-name">${escapeHtml(order.customer_name)}</div>
        <div class="customer-mode">${escapeHtml(order.contact_info || '')}</div>
      </div>

      ${deliveryBoxHTML}
      ${paymentBoxHTML}

      <div class="order-items-list">
        ${itemsHTML}
      </div>

      <div class="order-total-bar">
        <span>Total:</span>
        <span>₱${parseFloat(order.total).toFixed(2)}</span>
      </div>

      <div class="order-actions">
        ${nextStatusBtnHTML}
        ${verifyPayBtnHTML}
        ${gmapsBtnHTML}
        ${receiptBtnHTML}
        ${cancelBtnHTML}
        ${deleteBtnHTML}
      </div>
    </div>
  `;
}

// Global scope window functions for inline button triggers
window.updateOrderStatus = async function(orderId, newStatus) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(`Order #${orderId} set to "${newStatus}"`, 'success');
      fetchOrders();
      fetchAnalytics();
    } else {
      showToast(data.error || 'Failed to update order status', 'error');
    }
  } catch (err) {
    showToast('Network error updating status', 'error');
  }
};

window.toggleOrderPayment = async function(orderId, newPayStatus) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ payment_status: newPayStatus })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(`Order #${orderId} payment marked as "${newPayStatus}"`, 'success');
      fetchOrders();
      fetchAnalytics();
    } else {
      showToast(data.error || 'Failed to update payment status', 'error');
    }
  } catch (err) {
    showToast('Network error updating payment', 'error');
  }
};

window.openReceiptImgModal = function(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order || !order.payment_receipt) {
    showToast('No receipt image attached to this order.', 'info');
    return;
  }
  const modal = document.getElementById('receipt-img-modal');
  const img = document.getElementById('receipt-full-img');
  if (modal && img) {
    img.src = order.payment_receipt;
    modal.style.display = 'flex';
  }
};

window.closeReceiptImgModal = function() {
  const modal = document.getElementById('receipt-img-modal');
  if (modal) modal.style.display = 'none';
};

window.deleteOrder = async function(orderId) {
  if (!confirm(`Are you sure you want to delete order #${orderId}?`)) return;
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(`Order #${orderId} deleted`, 'info');
      fetchOrders();
      fetchAnalytics();
    } else {
      showToast(data.error || 'Failed to delete order', 'error');
    }
  } catch (err) {
    showToast('Network error deleting order', 'error');
  }
};

// ==========================================
// THERMAL POS RECEIPT MODAL
// ==========================================
window.openReceiptModal = function(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const isDelivery = (order.fulfillment_mode || '').toLowerCase() === 'delivery';

  document.getElementById('rec-order-id').textContent = `#${order.id}`;
  document.getElementById('rec-date').textContent = new Date(order.created_at || Date.now()).toLocaleString();
  document.getElementById('rec-cust').textContent = order.customer_name;
  document.getElementById('rec-type').textContent = order.fulfillment_mode.toUpperCase();

  const recPayment = document.getElementById('rec-payment');
  if (recPayment) {
    const isGcash = (order.payment_method || '').toLowerCase() === 'gcash';
    if (isGcash) {
      recPayment.textContent = `GCASH (REF: ${order.payment_reference || 'N/A'})`;
    } else {
      recPayment.textContent = 'CASH';
    }
  }

  const itemsContainer = document.getElementById('rec-items-list');
  itemsContainer.innerHTML = (order.items || []).map(item => `
    <div class="receipt-item-row">
      <span>${item.quantity}x ${item.item_name} ${item.custom_options ? `(${item.custom_options})` : ''}</span>
      <span>₱${(item.unit_price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  // Handle Delivery Section on Receipt
  const receiptMeta = document.querySelector('.receipt-meta');
  let existingDeliveryBlock = document.getElementById('rec-delivery-block');
  if (existingDeliveryBlock) existingDeliveryBlock.remove();

  if (isDelivery) {
    let gmapsUrl = order.delivery_maps_url;
    if (!gmapsUrl && order.delivery_lat && order.delivery_lng) {
      gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=7.1420,125.6265&destination=${order.delivery_lat},${order.delivery_lng}`;
    } else if (!gmapsUrl) {
      gmapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(order.delivery_address || 'Davao City')}`;
    }

    const delDiv = document.createElement('div');
    delDiv.id = 'rec-delivery-block';
    delDiv.className = 'receipt-delivery-section';
    delDiv.innerHTML = `
      <div class="receipt-divider">--------------------------------</div>
      <div><strong>DELIVERY DESTINATION:</strong></div>
      <div>${escapeHtml(order.delivery_address || 'Customer Pinned Location')}</div>
      ${order.delivery_notes ? `<div><em>Landmark: ${escapeHtml(order.delivery_notes)}</em></div>` : ''}
      <div><a href="${gmapsUrl}" target="_blank" style="color:#000; text-decoration:underline;">📍 [Open Google Maps Directions]</a></div>
    `;
    itemsContainer.parentNode.insertBefore(delDiv, itemsContainer.nextSibling);
  }

  document.getElementById('rec-subtotal').textContent = `₱${parseFloat(order.subtotal || (order.total / 1.12)).toFixed(2)}`;
  document.getElementById('rec-tax').textContent = `₱${parseFloat(order.tax || (order.total - (order.total / 1.12))).toFixed(2)}`;
  document.getElementById('rec-total').textContent = `₱${parseFloat(order.total).toFixed(2)}`;

  document.getElementById('receipt-modal').style.display = 'flex';
};

function closeReceiptModal() {
  document.getElementById('receipt-modal').style.display = 'none';
}

// ==========================================
// FAST WALK-IN / COUNTER POS ORDER MODAL
// ==========================================
function openWalkinModal() {
  const select = document.getElementById('walkin-item-select');
  select.innerHTML = '<option value="">Select a menu item...</option>' + 
    menuItems.map(m => `<option value="${m.id}" data-name="${escapeHtml(m.name)}" data-price="${m.basePrice}">${escapeHtml(m.name)} - ₱${m.basePrice.toFixed(2)} (${m.category})</option>`).join('');

  document.getElementById('walkin-cust-name').value = 'Counter Walk-In';
  document.getElementById('walkin-qty').value = '1';
  document.getElementById('walkin-notes').value = '';

  const paySelect = document.getElementById('walkin-payment-method');
  if (paySelect) paySelect.value = 'Cash';
  const refWrap = document.getElementById('walkin-ref-wrap');
  if (refWrap) refWrap.style.display = 'none';
  const refInput = document.getElementById('walkin-payment-ref');
  if (refInput) refInput.value = '';

  document.getElementById('walkin-modal').style.display = 'flex';
}

function closeWalkinModal() {
  document.getElementById('walkin-modal').style.display = 'none';
}

async function handleWalkinSubmit(e) {
  e.preventDefault();
  const custName = document.getElementById('walkin-cust-name').value.trim() || 'Counter Walk-In';
  const select = document.getElementById('walkin-item-select');
  const selectedOpt = select.options[select.selectedIndex];
  
  if (!selectedOpt.value) {
    showToast('Please select a menu item.', 'error');
    return;
  }

  const itemId = selectedOpt.value;
  const itemName = selectedOpt.getAttribute('data-name');
  const unitPrice = parseFloat(selectedOpt.getAttribute('data-price') || 0);
  const qty = parseInt(document.getElementById('walkin-qty').value, 10) || 1;
  const notes = document.getElementById('walkin-notes').value.trim();

  const payMethod = document.getElementById('walkin-payment-method')?.value || 'Cash';
  const payRef = document.getElementById('walkin-payment-ref')?.value.trim() || '';

  if (payMethod === 'GCash') {
    const cleanRef = payRef.replace(/\D/g, '');
    if (!cleanRef) {
      showToast('GCash Reference Number is required for GCash walk-in orders.', 'error');
      document.getElementById('walkin-payment-ref')?.focus();
      return;
    }
    if (cleanRef.length !== 13) {
      showToast(`GCash Reference Number must be exactly 13 digits (entered ${cleanRef.length}).`, 'error');
      document.getElementById('walkin-payment-ref')?.focus();
      return;
    }
  }

  const payStatus = payMethod === 'GCash' ? 'Verified / Paid' : 'Paid';

  const subtotal = unitPrice * qty;
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const orderPayload = {
    customer_name: custName,
    fulfillment_mode: 'pickup',
    contact_info: `Counter POS Order • 💳 ${payMethod}${payRef ? ` (Ref #${payRef})` : ''}`,
    cart: [{
      id: itemId,
      name: itemName,
      price: unitPrice,
      qty: qty,
      customText: notes || 'Standard Recipe'
    }],
    subtotal: subtotal,
    tax: tax,
    total: total,
    status: 'Pending',
    payment_method: payMethod,
    payment_reference: payRef,
    payment_status: payStatus,
    payment_receipt: ''
  };

  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderPayload)
    });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast(`Walk-In Order #${result.order_id} recorded! ☕`, 'success');
      closeWalkinModal();
      fetchOrders();
      fetchAnalytics();
    } else {
      showToast(result.error || 'Failed to submit order', 'error');
    }
  } catch (err) {
    showToast('Network error creating walk-in order', 'error');
  }
}

// ==========================================
// MENU ITEMS CRUD LOGIC
// ==========================================

async function fetchMenu() {
  try {
    const res = await fetch(`${API_BASE_URL}/menu`);
    if (res.ok) {
      menuItems = await res.json();
      renderMenuTable();
    }
  } catch (err) {
    console.error("Error fetching menu catalog:", err);
  }
}

function renderMenuTable() {
  const tbody = document.getElementById('menu-table-body');
  if (!tbody) return;

  const searchQuery = (document.getElementById('menu-search-input')?.value || '').toLowerCase();
  const categoryFilter = document.getElementById('menu-category-filter')?.value || 'all';

  let filtered = menuItems.filter(item => {
    const matchCategory = (categoryFilter === 'all') || (item.category === categoryFilter);
    const matchSearch = item.name.toLowerCase().includes(searchQuery) ||
                        item.id.toLowerCase().includes(searchQuery) ||
                        (item.desc && item.desc.toLowerCase().includes(searchQuery));
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">No menu items found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const sizesStr = item.hasSizes 
      ? `8oz: ₱${item.price8oz} | 12oz: ₱${item.price12oz} | 16oz: ₱${item.price16oz}`
      : 'Single Size';
    
    const optionsArr = [];
    if (item.hasMilk) optionsArr.push('Milk');
    if (item.hasSyrups) optionsArr.push('Syrups');
    if (item.hasExtraShot) optionsArr.push('Extra Shot');
    const optionsStr = optionsArr.length ? optionsArr.join(', ') : 'None';

    const canEdit = currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff');
    const isAvail = item.isAvailable !== false;
    const stockBtnHTML = canEdit ? `
      <button class="btn-stock-toggle ${isAvail ? 'in-stock' : 'out-of-stock'}" onclick="toggleItemStock('${item.id}', ${!isAvail})">
        <i class="fa-solid ${isAvail ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${isAvail ? 'In Stock' : 'Out of Stock'}
      </button>
    ` : `<span class="stock-badge ${isAvail ? 'in-stock' : 'out-of-stock'}">${isAvail ? 'In Stock' : 'Out of Stock'}</span>`;

    const actionButtons = canEdit ? `
      <div class="table-actions">
        <button class="btn-tbl-edit" onclick="openMenuModal('edit', '${item.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn-tbl-delete" onclick="deleteMenuItem('${item.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    ` : '<span class="text-muted">Read Only</span>';

    return `
      <tr>
        <td><span class="item-id-badge">${item.id}</span></td>
        <td><span class="category-tag">${item.category}</span></td>
        <td>
          <strong>${escapeHtml(item.name)}</strong>
          ${item.desc ? `<br><small class="text-muted">${escapeHtml(item.desc)}</small>` : ''}
        </td>
        <td><strong>₱${parseFloat(item.basePrice).toFixed(2)}</strong></td>
        <td><small>${sizesStr}</small></td>
        <td><small>${optionsStr}</small></td>
        <td>${stockBtnHTML}</td>
        <td>${actionButtons}</td>
      </tr>
    `;
  }).join('');
}

async function toggleItemStock(itemId, newStatus) {
  try {
    const res = await fetch(`${API_BASE_URL}/menu/${itemId}/stock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': authToken,
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ isAvailable: newStatus })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message || 'Stock status updated!');
      await fetchMenu();
    } else {
      showToast(data.error || 'Failed to update stock status', 'error');
    }
  } catch (err) {
    showToast('Network error updating stock status', 'error');
  }
}
window.toggleItemStock = toggleItemStock;

function openMenuModal(mode, itemId = null) {
  const modal = document.getElementById('menu-modal');
  const title = document.getElementById('menu-modal-title');
  const form = document.getElementById('menu-form');
  const editMode = document.getElementById('menu-edit-mode');
  const menuIdInput = document.getElementById('menu-id');

  editMode.value = mode;

  if (mode === 'create') {
    title.innerHTML = `<i class="fa-solid fa-plus"></i> Add New Menu Item`;
    form.reset();
    menuIdInput.disabled = false;
    menuIdInput.value = `custom-${Math.floor(100 + Math.random() * 900)}`;
  } else {
    title.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Menu Item`;
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;

    menuIdInput.value = item.id;
    menuIdInput.disabled = true;
    document.getElementById('menu-category').value = item.category;
    document.getElementById('menu-name').value = item.name;
    document.getElementById('menu-desc').value = item.desc || '';
    document.getElementById('menu-base-price').value = item.basePrice;
    document.getElementById('menu-price-8oz').value = item.price8oz || item.basePrice;
    document.getElementById('menu-price-12oz').value = item.price12oz || item.basePrice;
    document.getElementById('menu-price-16oz').value = item.price16oz || item.basePrice;
    
    document.getElementById('menu-has-sizes').checked = item.hasSizes;
    document.getElementById('menu-has-milk').checked = item.hasMilk;
    document.getElementById('menu-has-syrups').checked = item.hasSyrups;
    document.getElementById('menu-has-extra-shot').checked = item.hasExtraShot;
    document.getElementById('menu-pairing').value = item.pairingRecommendation || '';
  }

  modal.style.display = 'flex';
}

function closeMenuModal() {
  document.getElementById('menu-modal').style.display = 'none';
}

async function handleMenuFormSubmit(e) {
  e.preventDefault();
  const mode = document.getElementById('menu-edit-mode').value;
  const itemId = document.getElementById('menu-id').value.trim();

  const payload = {
    id: itemId,
    category: document.getElementById('menu-category').value,
    name: document.getElementById('menu-name').value.trim(),
    desc: document.getElementById('menu-desc').value.trim(),
    basePrice: parseFloat(document.getElementById('menu-base-price').value),
    price8oz: parseFloat(document.getElementById('menu-price-8oz').value || document.getElementById('menu-base-price').value),
    price12oz: parseFloat(document.getElementById('menu-price-12oz').value || document.getElementById('menu-base-price').value),
    price16oz: parseFloat(document.getElementById('menu-price-16oz').value || document.getElementById('menu-base-price').value),
    hasSizes: document.getElementById('menu-has-sizes').checked,
    hasMilk: document.getElementById('menu-has-milk').checked,
    hasSyrups: document.getElementById('menu-has-syrups').checked,
    hasExtraShot: document.getElementById('menu-has-extra-shot').checked,
    pairingRecommendation: document.getElementById('menu-pairing').value.trim()
  };

  const method = mode === 'create' ? 'POST' : 'PUT';
  const url = mode === 'create' ? `${API_BASE_URL}/menu` : `${API_BASE_URL}/menu/${itemId}`;

  try {
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(data.message || 'Menu item saved successfully!', 'success');
      closeMenuModal();
      fetchMenu();
      fetchAnalytics();
    } else {
      showToast(data.error || 'Failed to save menu item', 'error');
    }
  } catch (err) {
    showToast('Error saving menu item', 'error');
  }
}

window.deleteMenuItem = async function(itemId) {
  if (!confirm(`Are you sure you want to delete menu item "${itemId}"?`)) return;
  try {
    const res = await fetch(`${API_BASE_URL}/menu/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(data.message || 'Menu item deleted', 'info');
      fetchMenu();
      fetchAnalytics();
    } else {
      showToast(data.error || 'Failed to delete menu item', 'error');
    }
  } catch (err) {
    showToast('Error deleting item', 'error');
  }
};

// ==========================================
// USER ACCOUNTS CRUD LOGIC (ADMIN ONLY)
// ==========================================

async function fetchUsers() {
  if (!currentUser || currentUser.role !== 'admin') return;
  try {
    const res = await fetch(`${API_BASE_URL}/users`, { headers: getAuthHeaders() });
    if (res.ok) {
      usersList = await res.json();
      renderUsersTable();
    }
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}

function renderUsersTable() {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  if (usersList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">No user accounts found.</td></tr>`;
    return;
  }

  tbody.innerHTML = usersList.map(u => {
    const roleClass = `role-${u.role}`;
    const contactParts = [];
    if (u.email) {
      contactParts.push(`<div><i class="fa-solid fa-envelope" style="font-size:0.75rem; color:#d4a373;"></i> <small>${escapeHtml(u.email)}</small></div>`);
    }
    if (u.phone) {
      contactParts.push(`<div><i class="fa-solid fa-phone" style="font-size:0.75rem; color:#2a9d8f;"></i> <small>${escapeHtml(u.phone)}</small></div>`);
    }
    const contactHtml = contactParts.length > 0 ? contactParts.join('') : '<span style="color:var(--text-muted); font-size:0.8rem;">None</span>';

    return `
      <tr>
        <td>#${u.id}</td>
        <td><strong>${escapeHtml(u.username)}</strong></td>
        <td>${escapeHtml(u.full_name)}</td>
        <td>${contactHtml}</td>
        <td><span class="user-role-pill ${roleClass}">${u.role.toUpperCase()}</span></td>
        <td><small>${parseIsoDate(u.created_at).toLocaleDateString()}</small></td>
        <td>
          <div class="table-actions">
            <button class="btn-tbl-edit" onclick="openUserModal('edit', ${u.id})"><i class="fa-solid fa-user-pen"></i> Edit</button>
            <button class="btn-tbl-delete" onclick="deleteUserAccount(${u.id})"><i class="fa-solid fa-user-minus"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openUserModal(mode, userId = null) {
  const modal = document.getElementById('user-modal');
  const title = document.getElementById('user-modal-title');
  const form = document.getElementById('user-form');
  const editMode = document.getElementById('user-edit-mode');
  const editId = document.getElementById('user-edit-id');
  const passwordNote = document.getElementById('password-req-note');
  const usernameInput = document.getElementById('user-username');

  editMode.value = mode;

  if (mode === 'create') {
    title.innerHTML = `<i class="fa-solid fa-user-plus"></i> Create New User Account`;
    form.reset();
    editId.value = '';
    usernameInput.disabled = false;
    document.getElementById('user-email').value = '';
    document.getElementById('user-phone').value = '';
    document.getElementById('user-address').value = '';
    document.getElementById('user-role').value = 'staff';
    passwordNote.textContent = '*';
    document.getElementById('user-password').required = true;
  } else {
    title.innerHTML = `<i class="fa-solid fa-user-gear"></i> Edit User Account`;
    const user = usersList.find(u => u.id === userId);
    if (!user) return;

    editId.value = user.id;
    usernameInput.value = user.username;
    usernameInput.disabled = true;
    document.getElementById('user-fullname').value = user.full_name;
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('user-phone').value = user.phone || '';
    document.getElementById('user-address').value = user.delivery_address || '';
    document.getElementById('user-role').value = user.role;
    document.getElementById('user-password').value = '';
    passwordNote.textContent = '(leave blank to keep unchanged)';
    document.getElementById('user-password').required = false;
  }

  modal.style.display = 'flex';
}

function closeUserModal() {
  document.getElementById('user-modal').style.display = 'none';
}

async function handleUserFormSubmit(e) {
  e.preventDefault();
  const mode = document.getElementById('user-edit-mode').value;
  const userId = document.getElementById('user-edit-id').value;

  const payload = {
    username: document.getElementById('user-username').value.trim(),
    full_name: document.getElementById('user-fullname').value.trim(),
    email: document.getElementById('user-email').value.trim(),
    phone: document.getElementById('user-phone').value.trim(),
    delivery_address: document.getElementById('user-address').value.trim(),
    role: document.getElementById('user-role').value,
    password: document.getElementById('user-password').value.trim()
  };

  const method = mode === 'create' ? 'POST' : 'PUT';
  const url = mode === 'create' ? `${API_BASE_URL}/users` : `${API_BASE_URL}/users/${userId}`;

  try {
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(data.message || 'User account saved!', 'success');
      closeUserModal();
      fetchUsers();
      fetchAnalytics();
    } else {
      showToast(data.error || 'Failed to save user account', 'error');
    }
  } catch (err) {
    showToast('Error saving user account', 'error');
  }
}

window.deleteUserAccount = async function(userId) {
  if (!confirm(`Are you sure you want to delete user account #${userId}?`)) return;
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(data.message || 'User deleted', 'info');
      fetchUsers();
      fetchAnalytics();
    } else {
      showToast(data.error || 'Failed to delete user account', 'error');
    }
  } catch (err) {
    showToast('Error deleting user', 'error');
  }
};

// Visual 7-Day Revenue Chart & Detailed Analytics
async function fetchVisualSalesChart() {
  const container = document.getElementById('visual-sales-chart');
  if (!container || !currentToken) return;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': currentToken,
        'Authorization': `Bearer ${currentToken}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      const dailySales = data.dailySales || [];
      if (dailySales.length === 0) {
        container.innerHTML = `<p class="empty-state">No sales recorded in the last 7 days.</p>`;
        return;
      }

      const maxRev = Math.max(...dailySales.map(d => d.revenue), 100);

      container.innerHTML = dailySales.map(d => {
        const heightPct = Math.max(Math.round((d.revenue / maxRev) * 100), 5);
        return `
          <div class="chart-bar-col">
            <span class="chart-bar-val">₱${d.revenue.toFixed(0)}</span>
            <div class="chart-bar-fill-wrap" title="${d.date}: ₱${d.revenue.toFixed(2)} (${d.count} orders)">
              <div class="chart-bar-fill-inner" style="height: ${heightPct}%;"></div>
            </div>
            <span class="chart-bar-label">${d.date}</span>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    console.error("Error loading visual sales chart:", err);
  }
}

// Full-Screen Barista Kitchen Display System (KDS)
let kdsClockInterval = null;

function openKdsModal() {
  const modal = document.getElementById('kds-modal');
  if (!modal) return;
  modal.style.display = 'flex';

  updateKdsClock();
  if (kdsClockInterval) clearInterval(kdsClockInterval);
  kdsClockInterval = setInterval(updateKdsClock, 1000);

  renderKdsTickets();
}

function closeKdsModal() {
  const modal = document.getElementById('kds-modal');
  if (modal) modal.style.display = 'none';
  if (kdsClockInterval) clearInterval(kdsClockInterval);
}

function updateKdsClock() {
  const clockEl = document.getElementById('kds-clock');
  if (clockEl) {
    clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  renderKdsTickets();
}

function renderKdsTickets() {
  const grid = document.getElementById('kds-tickets-grid');
  if (!grid) return;

  const activeKitchenOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing');

  if (activeKitchenOrders.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #bcac9b;">
        <i class="fa-solid fa-mug-hot" style="font-size: 3.5rem; margin-bottom: 1rem; color: #2a9d8f;"></i>
        <h2>Kitchen Queue is Clear! 🎉</h2>
        <p style="margin-top: 0.5rem; font-size: 1.1rem;">No active orders waiting for preparation right now.</p>
      </div>
    `;
    return;
  }

  const now = new Date();

  grid.innerHTML = activeKitchenOrders.map(o => {
    const createdDate = parseIsoDate(o.created_at);
    const elapsedMins = Math.floor((now.getTime() - createdDate.getTime()) / 60000);

    let timerColor = '#2a9d8f';
    if (elapsedMins >= 10) timerColor = '#e63946';
    else if (elapsedMins >= 5) timerColor = '#f4a261';

    const itemsHTML = (o.items || []).map(i => `
      <div class="kds-item-row">
        <div>
          <span class="kds-item-qty">${i.quantity}x</span>
          <span class="kds-item-name">${escapeHtml(i.item_name)}</span>
          ${i.custom_options ? `<span class="kds-item-opt"><i class="fa-solid fa-layer-group"></i> ${escapeHtml(i.custom_options)}</span>` : ''}
        </div>
      </div>
    `).join('');

    const nextActionBtn = o.status === 'Pending'
      ? `<button class="btn-kds-action prep" onclick="updateOrderStatus(${o.id}, 'Preparing')"><i class="fa-solid fa-fire"></i> START PREPARING</button>`
      : `<button class="btn-kds-action ready" onclick="updateOrderStatus(${o.id}, 'Ready')"><i class="fa-solid fa-bell"></i> MARK READY</button>`;

    return `
      <div class="kds-card status-${(o.status || 'Pending').toLowerCase()}">
        <div>
          <div class="kds-card-header">
            <span class="kds-order-id">#${o.id} • ${escapeHtml(o.fulfillment_mode || 'Pickup').toUpperCase()}</span>
            <span class="kds-timer-badge" style="color: ${timerColor}; background: rgba(0,0,0,0.3); border: 1px solid ${timerColor};">
              <i class="fa-solid fa-clock"></i> ${elapsedMins} min ago
            </span>
          </div>

          <div class="kds-customer-name">
            <i class="fa-solid fa-user"></i> ${escapeHtml(o.customer_name)}
            <small style="font-weight: normal; font-size: 0.85rem; color: #d4a373; display: block; margin-top: 2px;">
              ${escapeHtml(o.contact_info || '')}
            </small>
          </div>

          <div class="kds-items-list">
            ${itemsHTML}
          </div>
        </div>

        <div class="kds-card-actions">
          ${nextActionBtn}
        </div>
      </div>
    `;
  }).join('');
}

window.openKdsModal = openKdsModal;
window.closeKdsModal = closeKdsModal;

/* Staff Live Customer Support Chat Portal */
let activeStaffChatSession = null;
let activeStaffCustomerName = '';
let staffChatPollInterval = null;
let lastStaffUnreadCount = 0;
let allStaffConversations = [];

function playStaffChatAlert() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    // Kitchen bell ding (C6: 1046.5Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  } catch (e) {}
}

function openStaffChatModal() {
  const modal = document.getElementById('staff-chat-modal');
  if (!modal) return;
  modal.style.display = 'flex';

  loadStaffChatConversations();
  if (staffChatPollInterval) clearInterval(staffChatPollInterval);
  staffChatPollInterval = setInterval(loadStaffChatConversations, 3000);

  const form = document.getElementById('staff-chat-reply-form');
  if (form) {
    form.onsubmit = handleStaffChatReplySubmit;
  }

  // Setup search input listener
  const searchInput = document.getElementById('staff-chat-search-input');
  if (searchInput) {
    searchInput.oninput = filterStaffChatConversations;
  }

  // Setup quick canned reply buttons
  document.querySelectorAll('.staff-canned-btn').forEach(btn => {
    btn.onclick = () => {
      const reply = btn.getAttribute('data-reply');
      const input = document.getElementById('staff-chat-reply-input');
      if (input && reply && activeStaffChatSession) {
        input.value = reply;
        form?.dispatchEvent(new Event('submit'));
      }
    };
  });

  // Setup delete conversation button
  const btnDelete = document.getElementById('btn-staff-delete-conv');
  if (btnDelete) {
    btnDelete.onclick = handleStaffDeleteConversation;
  }
}

function closeStaffChatModal() {
  const modal = document.getElementById('staff-chat-modal');
  if (modal) modal.style.display = 'none';
  if (staffChatPollInterval) clearInterval(staffChatPollInterval);
}

async function loadStaffChatConversations() {
  const listContainer = document.getElementById('staff-chat-sessions-list');
  const badgeCount = document.getElementById('staff-chat-unread-count');

  try {
    const res = await fetch(`${API_BASE_URL}/admin/chat/conversations`, {
      headers: getAuthHeaders()
    });

    if (res.ok) {
      allStaffConversations = await res.json();

      let totalUnread = 0;
      allStaffConversations.forEach(c => totalUnread += (c.unread_count || 0));

      if (badgeCount) {
        if (totalUnread > 0) {
          badgeCount.textContent = totalUnread;
          badgeCount.style.display = 'inline-flex';
        } else {
          badgeCount.style.display = 'none';
        }
      }

      // Audio notification if unread count increased
      if (totalUnread > lastStaffUnreadCount) {
        playStaffChatAlert();
      }
      lastStaffUnreadCount = totalUnread;

      if (!listContainer) return;
      renderStaffConversationList(allStaffConversations);

      if (activeStaffChatSession) {
        loadStaffChatMessages(activeStaffChatSession);
      }
    }
  } catch (err) {
    console.error("Error fetching chat conversations:", err);
  }
}

function filterStaffChatConversations() {
  const query = (document.getElementById('staff-chat-search-input')?.value || '').toLowerCase().trim();
  if (!query) {
    renderStaffConversationList(allStaffConversations);
    return;
  }
  const filtered = allStaffConversations.filter(c => 
    (c.customer_name || '').toLowerCase().includes(query) ||
    (c.last_message || '').toLowerCase().includes(query) ||
    (c.session_id || '').toLowerCase().includes(query)
  );
  renderStaffConversationList(filtered);
}

function renderStaffConversationList(conversations) {
  const listContainer = document.getElementById('staff-chat-sessions-list');
  if (!listContainer) return;

  if (conversations.length === 0) {
    listContainer.innerHTML = `<p class="empty-state">No matching conversations.</p>`;
    return;
  }

  listContainer.innerHTML = conversations.map(c => {
    const isActive = activeStaffChatSession === c.session_id;
    const timeStr = parseIsoDate(c.last_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const unreadTag = c.unread_count > 0 ? `<span class="badge-count" style="background:#e63946;">${c.unread_count}</span>` : '';
    const isGuest = c.is_guest || (c.session_id && c.session_id.startsWith('chat-guest-'));
    const guestBadge = isGuest
      ? `<span style="font-size:0.65rem; background:#4b382a; color:#f0c382; padding:1px 6px; border-radius:8px; margin-left:4px;">Guest</span>`
      : `<span style="font-size:0.65rem; background:#1b3d2f; color:#52b788; padding:1px 6px; border-radius:8px; margin-left:4px;"><i class="fa-solid fa-user-check" style="font-size:0.55rem;"></i> Member</span>`;

    return `
      <div class="staff-conv-item ${isActive ? 'active' : ''}" onclick="selectStaffChatSession('${c.session_id}', '${escapeHtml(c.customer_name)}')">
        <div class="staff-conv-top">
          <span class="staff-conv-name"><i class="fa-solid fa-user text-gold"></i> ${escapeHtml(c.customer_name)} ${guestBadge}</span>
          ${unreadTag}
        </div>
        <div class="staff-conv-msg">${escapeHtml(c.last_message || 'No messages')}</div>
        <div class="staff-conv-time">${timeStr}</div>
      </div>
    `;
  }).join('');
}

async function selectStaffChatSession(sessionId, customerName) {
  activeStaffChatSession = sessionId;
  activeStaffCustomerName = customerName || 'Guest';

  const activeTitle = document.getElementById('staff-chat-active-title');
  const activeActions = document.getElementById('staff-chat-active-actions');
  const cannedBar = document.getElementById('staff-quick-canned-bar');
  const input = document.getElementById('staff-chat-reply-input');
  const sendBtn = document.getElementById('staff-chat-send-btn');

  if (activeTitle) {
    activeTitle.querySelector('span').innerHTML = `Chatting with: <strong>${escapeHtml(customerName)}</strong> <span style="font-size:0.75rem; color:var(--text-muted); margin-left:6px;">(${sessionId})</span>`;
  }
  if (activeActions) activeActions.style.display = 'block';
  if (cannedBar) cannedBar.style.display = 'flex';
  if (input) {
    input.disabled = false;
    input.placeholder = `Type reply to ${escapeHtml(customerName)}...`;
    input.focus();
  }
  if (sendBtn) sendBtn.disabled = false;

  try {
    await fetch(`${API_BASE_URL}/admin/chat/read/${sessionId}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
  } catch (e) {}

  await loadStaffChatMessages(sessionId);
  loadStaffChatConversations();
}

async function loadStaffChatMessages(sessionId) {
  const container = document.getElementById('staff-chat-messages-box');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/chat/messages/${sessionId}`);
    if (res.ok) {
      const messages = await res.json();
      if (messages.length === 0) {
        container.innerHTML = '<p class="empty-state">No messages in this conversation yet.</p>';
        return;
      }

      container.innerHTML = messages.map(m => {
        const isStaff = m.sender === 'staff';
        const isAi = m.sender === 'assistant';
        const timeStr = parseIsoDate(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const senderLabel = isStaff ? 'Barista Staff' : (isAi ? '🤖 Jules AI Assistant' : escapeHtml(m.customer_name));

        return `
          <div class="staff-chat-bubble ${isStaff ? 'staff' : (isAi ? 'assistant' : 'customer')}">
            ${escapeHtml(m.message).replace(/\n/g, '<br>')}
            <span class="chat-bubble-time" style="font-size:0.65rem; opacity:0.75; display:block; margin-top:3px;">
              ${senderLabel} • ${timeStr}
            </span>
          </div>
        `;
      }).join('');

      container.scrollTop = container.scrollHeight;
    }
  } catch (err) {
    console.error("Error loading chat messages:", err);
  }
}

async function handleStaffChatReplySubmit(e) {
  e.preventDefault();
  if (!activeStaffChatSession) return;

  const input = document.getElementById('staff-chat-reply-input');
  const text = (input ? input.value : '').trim();
  if (!text) return;

  if (input) input.value = '';

  try {
    const res = await fetch(`${API_BASE_URL}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: activeStaffChatSession,
        customer_name: activeStaffCustomerName || 'Guest',
        sender: 'staff',
        message: text
      })
    });

    if (res.ok) {
      await loadStaffChatMessages(activeStaffChatSession);
      loadStaffChatConversations();
    }
  } catch (err) {
    showToast("Error sending reply", "error");
  }
}

async function handleStaffDeleteConversation() {
  if (!activeStaffChatSession) return;
  if (!confirm('Are you sure you want to delete this customer conversation?')) return;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/chat/conversations/${activeStaffChatSession}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (res.ok) {
      showToast("Conversation deleted successfully", "success");
      activeStaffChatSession = null;
      document.getElementById('staff-chat-active-title').querySelector('span').textContent = 'Select a conversation from the left to start chatting';
      document.getElementById('staff-chat-active-actions').style.display = 'none';
      document.getElementById('staff-quick-canned-bar').style.display = 'none';
      document.getElementById('staff-chat-messages-box').innerHTML = '<p class="empty-state">No chat session selected</p>';
      const input = document.getElementById('staff-chat-reply-input');
      const sendBtn = document.getElementById('staff-chat-send-btn');
      if (input) { input.disabled = true; input.value = ''; }
      if (sendBtn) sendBtn.disabled = true;
      loadStaffChatConversations();
    } else {
      showToast("Failed to delete conversation", "error");
    }
  } catch (err) {
    showToast("Network error deleting conversation", "error");
  }
}

window.openStaffChatModal = openStaffChatModal;
window.closeStaffChatModal = closeStaffChatModal;
window.selectStaffChatSession = selectStaffChatSession;

