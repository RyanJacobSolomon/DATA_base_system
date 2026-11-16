/**
 * ========================================================
 * JULES CAFE — UNIFIED AUTHENTICATION & REGISTRATION SYSTEM
 * ========================================================
 */

(function () {
  const API_BASE_URL = window.location.origin.includes(':5000') 
    ? '/api' 
    : 'http://localhost:5000/api';

  let currentUser = null;
  let authToken = localStorage.getItem('jules_auth_token') || null;

  try {
    const saved = localStorage.getItem('jules_auth_user');
    if (saved) currentUser = JSON.parse(saved);
  } catch (e) {
    currentUser = null;
  }

  function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['X-Auth-Token'] = authToken;
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message, type = 'info') {
    let toast = document.getElementById('auth-toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'auth-toast-notification';
      toast.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 2000000;
        padding: 0.75rem 1.25rem;
        border-radius: 12px;
        font-size: 0.88rem;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        color: #fff;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        transition: all 0.3s ease;
        animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      document.body.appendChild(toast);
    }

    if (type === 'error') {
      toast.style.background = '#e63946';
      toast.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${escapeHtml(message)}`;
    } else if (type === 'success') {
      toast.style.background = '#2a9d8f';
      toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapeHtml(message)}`;
    } else {
      toast.style.background = '#24160e';
      toast.style.border = '1px solid #d9a75c';
      toast.style.color = '#f7ecd9';
      toast.innerHTML = `<i class="fa-solid fa-mug-hot" style="color:#d9a75c;"></i> ${escapeHtml(message)}`;
    }

    toast.style.display = 'flex';
    toast.style.opacity = '1';

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 3500);
  }

  // --- API Methods ---
  async function apiLogin(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('jules_auth_token', authToken);
    localStorage.setItem('jules_auth_user', JSON.stringify(currentUser));
    localStorage.setItem('jules_customer_name', currentUser.full_name);

    if (window.JulesChat && window.JulesChat.resetChatForAccount) {
      window.JulesChat.resetChatForAccount(currentUser, false);
    } else if (window.JulesChat && window.JulesChat.setCustomerName) {
      window.JulesChat.setCustomerName(currentUser.full_name);
    }

    onAuthStateChanged();
    return data;
  }

  async function apiRegister(formData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('jules_auth_token', authToken);
    localStorage.setItem('jules_auth_user', JSON.stringify(currentUser));
    localStorage.setItem('jules_customer_name', currentUser.full_name);

    // Fresh new chat specifically for newly registered user!
    if (window.JulesChat && window.JulesChat.resetChatForAccount) {
      window.JulesChat.resetChatForAccount(currentUser, true);
    } else if (window.JulesChat && window.JulesChat.setCustomerName) {
      window.JulesChat.setCustomerName(currentUser.full_name);
    }

    onAuthStateChanged();
    return data;
  }

  async function apiLogout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (e) {}

    authToken = null;
    currentUser = null;
    localStorage.removeItem('jules_auth_token');
    localStorage.removeItem('jules_auth_user');
    localStorage.setItem('jules_customer_name', 'Guest');

    if (window.JulesChat && window.JulesChat.resetChatForAccount) {
      window.JulesChat.resetChatForAccount(null);
    } else if (window.JulesChat && window.JulesChat.setCustomerName) {
      window.JulesChat.setCustomerName('Guest');
    }

    onAuthStateChanged();
    showToast('Signed out successfully.', 'info');
  }

  async function apiCheckSession() {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          currentUser = data.user;
          localStorage.setItem('jules_auth_user', JSON.stringify(currentUser));
          onAuthStateChanged();
        } else {
          apiLogout();
        }
      }
    } catch (e) {}
  }

  async function apiUpdateProfile(payload) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');

    currentUser = data.user;
    localStorage.setItem('jules_auth_user', JSON.stringify(currentUser));
    localStorage.setItem('jules_customer_name', currentUser.full_name);

    onAuthStateChanged();
    return data;
  }

  async function apiFetchMyOrders() {
    const res = await fetch(`${API_BASE_URL}/customer/orders`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load orders');
    return data;
  }

  // --- UI Injections ---
  function injectAuthModals() {
    if (document.getElementById('jules-auth-modal-root')) return;

    const modalRoot = document.createElement('div');
    modalRoot.id = 'jules-auth-modal-root';
    modalRoot.innerHTML = `
      <!-- AUTHENTICATION (SIGN IN & REGISTER) MODAL -->
      <div id="auth-main-modal" class="auth-modal-backdrop hidden">
        <div class="auth-modal-card">
          <button type="button" class="auth-modal-close" id="btn-close-auth-modal">&times;</button>
          
          <div class="auth-modal-header">
            <img src="584927562_696803330152901_2932946184318253535_n.jpg" alt="Jules Cafe Logo" class="auth-brand-logo">
            <h3 id="auth-modal-title">Welcome to Jules Cafe</h3>
            <p id="auth-modal-subtitle">Sign in to save your favorite drinks, track orders, and order faster.</p>
          </div>

          <!-- Tabs: Sign In / Create Account -->
          <div class="auth-tabs">
            <button type="button" class="auth-tab-btn active" id="tab-btn-login">Sign In</button>
            <button type="button" class="auth-tab-btn" id="tab-btn-register">Create Account</button>
          </div>

          <div class="auth-form-wrap">
            <div id="auth-form-alert" class="auth-alert error hidden" style="margin-bottom: 12px;"></div>

            <!-- SIGN IN FORM -->
            <form id="auth-login-form" class="auth-form">
              <div class="auth-input-group">
                <label for="auth-login-user"><i class="fa-solid fa-user"></i> Username or Email</label>
                <div class="auth-input-field">
                  <i class="fa-solid fa-user field-icon"></i>
                  <input type="text" id="auth-login-user" placeholder="e.g. maria_santos or maria@gmail.com" required autocomplete="username">
                </div>
              </div>

              <div class="auth-input-group">
                <label for="auth-login-pass"><i class="fa-solid fa-lock"></i> Password</label>
                <div class="auth-input-field">
                  <i class="fa-solid fa-key field-icon"></i>
                  <input type="password" id="auth-login-pass" placeholder="Enter your password" required autocomplete="current-password">
                  <button type="button" class="btn-toggle-pw" data-target="auth-login-pass" title="Toggle password visibility">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-submit-login">
                <i class="fa-solid fa-right-to-bracket"></i> Sign In
              </button>

              <!-- One-Click Quick Demo Logins -->
              <div class="auth-demo-box">
                <span class="auth-demo-title"><i class="fa-solid fa-bolt"></i> Quick Demo Logins:</span>
                <div class="auth-demo-pills">
                  <button type="button" class="btn-demo-pill" data-u="customer" data-p="customer123">👤 Customer</button>
                  <button type="button" class="btn-demo-pill" data-u="staff" data-p="staff123">☕ Barista</button>
                  <button type="button" class="btn-demo-pill" data-u="admin" data-p="admin123">👑 Admin</button>
                </div>
              </div>

              <div class="auth-footer-toggle">
                Don't have an account yet? <a href="#" id="link-goto-register">Create one here</a>
              </div>
            </form>

            <!-- REGISTER FORM -->
            <form id="auth-register-form" class="auth-form hidden">
              <div class="auth-input-group">
                <label for="auth-reg-name"><i class="fa-solid fa-id-card"></i> Full Name *</label>
                <div class="auth-input-field">
                  <i class="fa-solid fa-signature field-icon"></i>
                  <input type="text" id="auth-reg-name" placeholder="e.g. Maria Santos" required autocomplete="name">
                </div>
              </div>

              <div class="auth-input-group">
                <label for="auth-reg-user"><i class="fa-solid fa-at"></i> Username *</label>
                <div class="auth-input-field">
                  <i class="fa-solid fa-user field-icon"></i>
                  <input type="text" id="auth-reg-user" placeholder="Choose a username (min 3 chars)" required autocomplete="username">
                </div>
              </div>

              <div style="display:flex; gap:0.6rem;">
                <div class="auth-input-group" style="flex:1;">
                  <label for="auth-reg-email"><i class="fa-solid fa-envelope"></i> Email (Optional)</label>
                  <div class="auth-input-field">
                    <i class="fa-solid fa-envelope field-icon"></i>
                    <input type="email" id="auth-reg-email" placeholder="maria@gmail.com" autocomplete="email">
                  </div>
                </div>

                <div class="auth-input-group" style="flex:1;">
                  <label for="auth-reg-phone"><i class="fa-solid fa-phone"></i> Mobile Phone</label>
                  <div class="auth-input-field">
                    <i class="fa-solid fa-phone field-icon"></i>
                    <input type="tel" id="auth-reg-phone" placeholder="0917-xxx-xxxx" autocomplete="tel">
                  </div>
                </div>
              </div>

              <div class="auth-input-group">
                <label for="auth-reg-address"><i class="fa-solid fa-map-location-dot"></i> Default Delivery Address (Optional)</label>
                <div class="auth-input-field">
                  <i class="fa-solid fa-location-dot field-icon"></i>
                  <input type="text" id="auth-reg-address" placeholder="e.g. Communal Road, Buhangin, Davao City">
                </div>
              </div>

              <div style="display:flex; gap:0.6rem;">
                <div class="auth-input-group" style="flex:1;">
                  <label for="auth-reg-pass"><i class="fa-solid fa-lock"></i> Password *</label>
                  <div class="auth-input-field">
                    <i class="fa-solid fa-key field-icon"></i>
                    <input type="password" id="auth-reg-pass" placeholder="Min 4 chars" required autocomplete="new-password">
                    <button type="button" class="btn-toggle-pw" data-target="auth-reg-pass"><i class="fa-regular fa-eye"></i></button>
                  </div>
                </div>

                <div class="auth-input-group" style="flex:1;">
                  <label for="auth-reg-confirm"><i class="fa-solid fa-shield-halved"></i> Confirm *</label>
                  <div class="auth-input-field">
                    <i class="fa-solid fa-key field-icon"></i>
                    <input type="password" id="auth-reg-confirm" placeholder="Repeat password" required autocomplete="new-password">
                    <button type="button" class="btn-toggle-pw" data-target="auth-reg-confirm"><i class="fa-regular fa-eye"></i></button>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-submit-register">
                <i class="fa-solid fa-user-plus"></i> Create Account
              </button>

              <div class="auth-footer-toggle">
                Already registered? <a href="#" id="link-goto-login">Sign in to your account</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- MY ORDERS MODAL -->
      <div id="auth-orders-modal" class="auth-modal-backdrop hidden">
        <div class="auth-modal-card customer-orders-modal">
          <button type="button" class="auth-modal-close" id="btn-close-orders-modal">&times;</button>
          
          <div class="auth-modal-header">
            <h3><i class="fa-solid fa-box-open text-gold"></i> My Order History</h3>
            <p>Track your active drink orders and review past cravings.</p>
          </div>

          <div class="orders-list-container" id="cust-orders-list-box">
            <p style="text-align:center; color:var(--auth-muted); padding:2rem 0;">Loading orders...</p>
          </div>
        </div>
      </div>

      <!-- MY PROFILE MODAL -->
      <div id="auth-profile-modal" class="auth-modal-backdrop hidden">
        <div class="auth-modal-card">
          <button type="button" class="auth-modal-close" id="btn-close-profile-modal">&times;</button>
          
          <div class="auth-modal-header">
            <div class="user-avatar-circle" style="width:50px; height:50px; font-size:1.3rem; margin:0 auto 0.6rem auto;" id="profile-avatar-big">U</div>
            <h3>My Profile & Settings</h3>
            <p>Update your personal information and default delivery address.</p>
          </div>

          <div class="auth-form-wrap">
            <div id="profile-form-alert" class="auth-alert success hidden" style="margin-bottom: 12px;"></div>

            <form id="auth-profile-form" class="auth-form">
              <div class="auth-input-group">
                <label for="prof-fullname"><i class="fa-solid fa-signature"></i> Full Name</label>
                <div class="auth-input-field">
                  <i class="fa-solid fa-user field-icon"></i>
                  <input type="text" id="prof-fullname" required>
                </div>
              </div>

              <div style="display:flex; gap:0.6rem;">
                <div class="auth-input-group" style="flex:1;">
                  <label for="prof-email"><i class="fa-solid fa-envelope"></i> Email</label>
                  <div class="auth-input-field">
                    <i class="fa-solid fa-envelope field-icon"></i>
                    <input type="email" id="prof-email" placeholder="email@domain.com">
                  </div>
                </div>

                <div class="auth-input-group" style="flex:1;">
                  <label for="prof-phone"><i class="fa-solid fa-phone"></i> Phone</label>
                  <div class="auth-input-field">
                    <i class="fa-solid fa-phone field-icon"></i>
                    <input type="tel" id="prof-phone" placeholder="09xx-xxx-xxxx">
                  </div>
                </div>
              </div>

              <div class="auth-input-group">
                <label for="prof-address"><i class="fa-solid fa-house"></i> Delivery Address</label>
                <div class="auth-input-field">
                  <i class="fa-solid fa-location-dot field-icon"></i>
                  <input type="text" id="prof-address" placeholder="Communal Road, Davao City">
                </div>
              </div>

              <div class="auth-input-group" style="border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 0.6rem; margin-top: 0.2rem;">
                <label for="prof-new-pass"><i class="fa-solid fa-key"></i> Change Password (Leave blank to keep current)</label>
                <div style="display:flex; gap:0.6rem; margin-top:4px;">
                  <div class="auth-input-field" style="flex:1;">
                    <i class="fa-solid fa-lock field-icon"></i>
                    <input type="password" id="prof-curr-pass" placeholder="Current password">
                  </div>
                  <div class="auth-input-field" style="flex:1;">
                    <i class="fa-solid fa-key field-icon"></i>
                    <input type="password" id="prof-new-pass" placeholder="New password">
                  </div>
                </div>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-save-profile">
                <i class="fa-solid fa-floppy-disk"></i> Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalRoot);
    setupModalListeners();
  }

  function setupModalListeners() {
    const authModal = document.getElementById('auth-main-modal');
    const ordersModal = document.getElementById('auth-orders-modal');
    const profileModal = document.getElementById('auth-profile-modal');

    // Close buttons
    document.getElementById('btn-close-auth-modal')?.addEventListener('click', () => authModal.classList.add('hidden'));
    document.getElementById('btn-close-orders-modal')?.addEventListener('click', () => ordersModal.classList.add('hidden'));
    document.getElementById('btn-close-profile-modal')?.addEventListener('click', () => profileModal.classList.add('hidden'));

    // Backdrop click closes
    [authModal, ordersModal, profileModal].forEach(m => {
      m?.addEventListener('click', (e) => {
        if (e.target === m) m.classList.add('hidden');
      });
    });

    // Tab switching
    const tabLogin = document.getElementById('tab-btn-login');
    const tabRegister = document.getElementById('tab-btn-register');
    const formLogin = document.getElementById('auth-login-form');
    const formRegister = document.getElementById('auth-register-form');
    const alertBox = document.getElementById('auth-form-alert');

    function switchTab(mode) {
      if (alertBox) alertBox.classList.add('hidden');
      if (mode === 'login') {
        tabLogin?.classList.add('active');
        tabRegister?.classList.remove('active');
        formLogin?.classList.remove('hidden');
        formRegister?.classList.add('hidden');
        document.getElementById('auth-modal-title').textContent = 'Sign In to Jules Cafe';
        document.getElementById('auth-modal-subtitle').textContent = 'Access your order history, faster checkout, and live support.';
      } else {
        tabRegister?.classList.add('active');
        tabLogin?.classList.remove('active');
        formRegister?.classList.remove('hidden');
        formLogin?.classList.add('hidden');
        document.getElementById('auth-modal-title').textContent = 'Create Customer Account';
        document.getElementById('auth-modal-subtitle').textContent = 'Join the Jules Cafe coffee community in Davao City!';
      }
    }

    tabLogin?.addEventListener('click', () => switchTab('login'));
    tabRegister?.addEventListener('click', () => switchTab('register'));
    document.getElementById('link-goto-register')?.addEventListener('click', (e) => { e.preventDefault(); switchTab('register'); });
    document.getElementById('link-goto-login')?.addEventListener('click', (e) => { e.preventDefault(); switchTab('login'); });

    // Password toggle eye buttons
    document.querySelectorAll('.btn-toggle-pw').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
        } else {
          input.type = 'password';
          btn.innerHTML = '<i class="fa-regular fa-eye"></i>';
        }
      });
    });

    // Demo pills click
    document.querySelectorAll('.btn-demo-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const u = btn.getAttribute('data-u');
        const p = btn.getAttribute('data-p');
        const userIn = document.getElementById('auth-login-user');
        const passIn = document.getElementById('auth-login-pass');
        if (userIn) userIn.value = u;
        if (passIn) passIn.value = p;
        formLogin?.dispatchEvent(new Event('submit'));
      });
    });

    // Form: Login Submit
    formLogin?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = document.getElementById('auth-login-user').value.trim();
      const p = document.getElementById('auth-login-pass').value.trim();
      const btn = document.getElementById('btn-submit-login');

      if (!u || !p) return;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';
      if (alertBox) alertBox.classList.add('hidden');

      try {
        const res = await apiLogin(u, p);
        showToast(res.message || 'Logged in successfully!', 'success');
        authModal.classList.add('hidden');
      } catch (err) {
        if (alertBox) {
          alertBox.textContent = err.message;
          alertBox.classList.remove('hidden');
        }
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
      }
    });

    // Form: Register Submit
    formRegister?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const full_name = document.getElementById('auth-reg-name').value.trim();
      const username = document.getElementById('auth-reg-user').value.trim();
      const email = document.getElementById('auth-reg-email').value.trim();
      const phone = document.getElementById('auth-reg-phone').value.trim();
      const delivery_address = document.getElementById('auth-reg-address').value.trim();
      const password = document.getElementById('auth-reg-pass').value.trim();
      const confirmPass = document.getElementById('auth-reg-confirm').value.trim();
      const btn = document.getElementById('btn-submit-register');

      if (password !== confirmPass) {
        if (alertBox) {
          alertBox.textContent = 'Passwords do not match. Please verify.';
          alertBox.classList.remove('hidden');
        }
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';
      if (alertBox) alertBox.classList.add('hidden');

      try {
        const res = await apiRegister({
          full_name,
          username,
          email,
          phone,
          delivery_address,
          password,
          role: 'customer'
        });
        showToast(res.message || 'Account created successfully!', 'success');
        authModal.classList.add('hidden');
      } catch (err) {
        if (alertBox) {
          alertBox.textContent = err.message;
          alertBox.classList.remove('hidden');
        }
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account';
      }
    });

    // Form: Profile Save Submit
    const formProfile = document.getElementById('auth-profile-form');
    const profAlert = document.getElementById('profile-form-alert');
    formProfile?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const full_name = document.getElementById('prof-fullname').value.trim();
      const email = document.getElementById('prof-email').value.trim();
      const phone = document.getElementById('prof-phone').value.trim();
      const delivery_address = document.getElementById('prof-address').value.trim();
      const current_password = document.getElementById('prof-curr-pass').value.trim();
      const new_password = document.getElementById('prof-new-pass').value.trim();
      const btn = document.getElementById('btn-save-profile');

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
      if (profAlert) profAlert.classList.add('hidden');

      try {
        const res = await apiUpdateProfile({
          full_name,
          email,
          phone,
          delivery_address,
          current_password,
          new_password
        });
        showToast('Profile updated successfully!', 'success');
        profileModal.classList.add('hidden');
      } catch (err) {
        if (profAlert) {
          profAlert.textContent = err.message;
          profAlert.className = 'auth-alert error';
          profAlert.classList.remove('hidden');
        }
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Profile Changes';
      }
    });
  }

  // --- Render Nav Account Widget ---
  function renderNavbarAuth() {
    // Desktop Nav
    const navContainers = [
      document.querySelector('.navbar .nav-links'),
      document.querySelector('#navbar .nav-links')
    ];

    navContainers.forEach(container => {
      if (!container) return;
      let existing = container.querySelector('.auth-nav-item');
      if (!existing) {
        existing = document.createElement('li');
        existing.className = 'auth-nav-item';
        // Insert right before Order Online button or at the end
        container.appendChild(existing);
      }

      if (currentUser) {
        const initial = (currentUser.full_name || currentUser.username || 'U')[0].toUpperCase();
        existing.innerHTML = `
          <div class="user-profile-widget" id="user-profile-widget">
            <button type="button" class="user-profile-pill" id="btn-toggle-user-menu">
              <span class="user-avatar-circle">${initial}</span>
              <span class="user-profile-name">${escapeHtml(currentUser.full_name || currentUser.username)}</span>
              <i class="fa-solid fa-chevron-down user-chevron"></i>
            </button>
            <div class="user-account-dropdown hidden" id="user-account-dropdown">
              <div class="user-dropdown-header">
                <p class="user-dropdown-title">${escapeHtml(currentUser.full_name)}</p>
                <div class="user-dropdown-sub">
                  <span>@${escapeHtml(currentUser.username)}</span>
                  <span class="user-role-badge">${escapeHtml(currentUser.role)}</span>
                </div>
              </div>
              <div class="user-dropdown-links">
                <button type="button" class="user-dropdown-link" id="btn-dropdown-orders">
                  <i class="fa-solid fa-box-open"></i> My Orders
                </button>
                <button type="button" class="user-dropdown-link" id="btn-dropdown-profile">
                  <i class="fa-solid fa-user-gear"></i> Account Settings
                </button>
                ${['admin', 'staff', 'employee'].includes(currentUser.role) ? `
                  <a href="admin.html" class="user-dropdown-link" style="color:var(--auth-gold);">
                    <i class="fa-solid fa-gauge-high"></i> Staff / Admin Portal
                  </a>
                ` : ''}
                <div class="user-dropdown-divider"></div>
                <button type="button" class="user-dropdown-link logout" id="btn-dropdown-logout">
                  <i class="fa-solid fa-right-from-bracket"></i> Sign Out
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        existing.innerHTML = `
          <button type="button" class="btn-auth-nav" id="btn-open-auth-nav">
            <i class="fa-solid fa-user-circle"></i> Sign In / Register
          </button>
        `;
      }
    });

    // Mobile Drawers
    const mobileContainers = [
      document.querySelector('.mobile-drawer .drawer-links'),
      document.querySelector('.mobile-menu')
    ];

    mobileContainers.forEach(container => {
      if (!container) return;
      let existing = container.querySelector('.auth-mobile-item');
      if (!existing) {
        existing = document.createElement('div');
        existing.className = 'auth-mobile-item';
        existing.style.margin = '10px 0';
        container.insertBefore(existing, container.firstChild);
      }

      if (currentUser) {
        existing.innerHTML = `
          <div style="background:rgba(217,167,92,0.1); border:1px solid rgba(217,167,92,0.25); border-radius:12px; padding:0.8rem; text-align:center;">
            <div style="font-weight:700; color:#fff; font-size:0.95rem;">Hi, ${escapeHtml(currentUser.full_name)}!</div>
            <div style="font-size:0.75rem; color:var(--auth-gold); margin-bottom:8px;">${currentUser.role.toUpperCase()}</div>
            <div style="display:flex; gap:6px; justify-content:center;">
              <button type="button" class="btn-demo-pill" id="btn-mobile-orders"><i class="fa-solid fa-box-open"></i> Orders</button>
              <button type="button" class="btn-demo-pill" id="btn-mobile-profile"><i class="fa-solid fa-user-pen"></i> Profile</button>
              <button type="button" class="btn-demo-pill" style="color:#ff6b6b; border-color:#e63946;" id="btn-mobile-logout">Logout</button>
            </div>
          </div>
        `;
      } else {
        existing.innerHTML = `
          <button type="button" class="btn-auth-nav" id="btn-open-auth-mobile" style="width:100%; justify-content:center; padding:0.7rem;">
            <i class="fa-solid fa-user-circle"></i> Sign In / Register
          </button>
        `;
      }
    });

    attachNavbarAuthEvents();
  }

  function attachNavbarAuthEvents() {
    // Sign In buttons
    document.querySelectorAll('#btn-open-auth-nav, #btn-open-auth-mobile').forEach(btn => {
      btn.onclick = () => openAuthModal('login');
    });

    // Dropdown toggle
    const pill = document.getElementById('btn-toggle-user-menu');
    const dropdown = document.getElementById('user-account-dropdown');
    if (pill && dropdown) {
      pill.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        pill.classList.toggle('active', !dropdown.classList.contains('hidden'));
      };

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#user-profile-widget')) {
          dropdown.classList.add('hidden');
          pill.classList.remove('active');
        }
      });
    }

    // Dropdown items
    document.getElementById('btn-dropdown-orders')?.addEventListener('click', openOrdersModal);
    document.getElementById('btn-mobile-orders')?.addEventListener('click', openOrdersModal);

    document.getElementById('btn-dropdown-profile')?.addEventListener('click', openProfileModal);
    document.getElementById('btn-mobile-profile')?.addEventListener('click', openProfileModal);

    document.getElementById('btn-dropdown-logout')?.addEventListener('click', apiLogout);
    document.getElementById('btn-mobile-logout')?.addEventListener('click', apiLogout);
  }

  function openAuthModal(tab = 'login') {
    injectAuthModals();
    const modal = document.getElementById('auth-main-modal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const tabBtn = tab === 'login' ? document.getElementById('tab-btn-login') : document.getElementById('tab-btn-register');
    tabBtn?.click();
  }

  async function openOrdersModal() {
    injectAuthModals();
    const modal = document.getElementById('auth-orders-modal');
    const listBox = document.getElementById('cust-orders-list-box');
    if (!modal || !listBox) return;

    modal.classList.remove('hidden');
    listBox.innerHTML = '<p style="text-align:center; color:var(--auth-muted); padding:2rem 0;"><i class="fa-solid fa-spinner fa-spin"></i> Loading your orders...</p>';

    try {
      const orders = await apiFetchMyOrders();
      if (orders.length === 0) {
        listBox.innerHTML = `
          <div style="text-align:center; padding:2rem 1rem;">
            <i class="fa-solid fa-mug-saucer text-gold" style="font-size:2.5rem; opacity:0.6; margin-bottom:12px;"></i>
            <h4 style="color:#fff; margin:0 0 6px 0;">No Orders Placed Yet</h4>
            <p style="color:var(--auth-muted); font-size:0.85rem; margin:0 0 1rem 0;">Browse our menu and treat yourself to Davao's best coffee!</p>
            <a href="orderonline.html" class="btn-demo-pill" style="display:inline-block; padding:0.5rem 1rem;">Order Now</a>
          </div>
        `;
        return;
      }

      listBox.innerHTML = orders.map(o => {
        const statusClass = (o.status || 'pending').toLowerCase();
        const dateStr = new Date(o.created_at || Date.now()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const itemsSummary = o.items.map(it => `&bull; <strong>${it.quantity}x</strong> ${escapeHtml(it.item_name)} ${it.custom_options ? `<span style="opacity:0.75; font-size:0.76rem;">(${escapeHtml(it.custom_options)})</span>` : ''}`).join('<br>');

        return `
          <div class="cust-order-card">
            <div class="cust-order-top">
              <span class="cust-order-id">Order #JULES-${o.id}</span>
              <span class="cust-order-status ${statusClass}">${escapeHtml(o.status || 'Pending')}</span>
            </div>
            <div class="cust-order-items-list">${itemsSummary}</div>
            <div class="cust-order-bottom">
              <div>
                <span>${dateStr} &bull; ${escapeHtml(o.fulfillment_mode.toUpperCase())}</span>
              </div>
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <span class="cust-order-total">₱${Number(o.total || 0).toFixed(2)}</span>
                <button type="button" class="btn-track-order-shortcut" onclick="window.JulesAuth.trackOrderInChat(${o.id})">
                  <i class="fa-solid fa-comments"></i> Track
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      listBox.innerHTML = `<p style="text-align:center; color:#ff6b6b; padding:1.5rem;">${escapeHtml(err.message)}</p>`;
    }
  }

  function openProfileModal() {
    injectAuthModals();
    const modal = document.getElementById('auth-profile-modal');
    if (!modal || !currentUser) return;

    modal.classList.remove('hidden');
    document.getElementById('prof-fullname').value = currentUser.full_name || '';
    document.getElementById('prof-email').value = currentUser.email || '';
    document.getElementById('prof-phone').value = currentUser.phone || '';
    document.getElementById('prof-address').value = currentUser.delivery_address || '';
    document.getElementById('prof-curr-pass').value = '';
    document.getElementById('prof-new-pass').value = '';

    const initial = (currentUser.full_name || currentUser.username || 'U')[0].toUpperCase();
    document.getElementById('profile-avatar-big').textContent = initial;
  }

  function trackOrderInChat(orderId) {
    document.getElementById('auth-orders-modal')?.classList.add('hidden');
    if (window.JulesChat && window.JulesChat.open) {
      window.JulesChat.open();
      setTimeout(() => {
        window.JulesChat.sendMessage(`📦 Track order #${orderId}`);
      }, 300);
    }
  }

  // --- Checkout Auto-Fill Integration ---
  function syncCheckoutForm() {
    if (!window.location.pathname.includes('orderonline')) return;

    const nameInput = document.getElementById('cust-name');
    const phoneInput = document.getElementById('cust-phone');
    const notesInput = document.getElementById('delivery-notes');
    const addrSearch = document.getElementById('delivery-address-search');
    const checkoutForm = document.getElementById('inline-checkout-form');

    if (!checkoutForm) return;

    let banner = document.getElementById('checkout-auth-indicator');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'checkout-auth-indicator';
      checkoutForm.insertBefore(banner, checkoutForm.firstChild);
    }

    if (currentUser) {
      if (nameInput) {
        nameInput.value = currentUser.full_name || '';
        nameInput.readOnly = true;
        nameInput.style.backgroundColor = 'rgba(217, 167, 92, 0.08)';
        nameInput.title = 'Account name locked to your signed-in profile';
      }
      if (phoneInput && !phoneInput.value && currentUser.phone) phoneInput.value = currentUser.phone;
      if (addrSearch && !addrSearch.value && currentUser.delivery_address) addrSearch.value = currentUser.delivery_address;

      banner.className = 'checkout-auth-banner';
      banner.innerHTML = `
        <i class="fa-solid fa-circle-check" style="font-size:1.1rem; color:#2a9d8f;"></i>
        <div>
          <strong>Signed in as ${escapeHtml(currentUser.full_name)}</strong>
          <span style="display:block; font-size:0.75rem; opacity:0.85;">Details auto-filled from your profile. Order will be saved to your account.</span>
        </div>
      `;
    } else {
      if (nameInput) {
        nameInput.value = '';
        nameInput.readOnly = false;
        nameInput.style.backgroundColor = '';
      }
      banner.className = 'checkout-auth-locked-banner';
      banner.style.cssText = 'background: rgba(217, 167, 92, 0.12); border: 1px solid var(--auth-gold, #d9a75c); border-radius: 8px; padding: 0.9rem 1rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;';
      banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <i class="fa-solid fa-lock" style="font-size:1.3rem; color:var(--auth-gold, #d9a75c);"></i>
          <div>
            <strong style="color:#fff; font-size:0.92rem;">Sign In Required to Order</strong>
            <span style="display:block; font-size:0.75rem; color:var(--auth-muted, #bcac9b);">You must be logged in before checking out.</span>
          </div>
        </div>
        <button type="button" class="btn-demo-pill" style="background:var(--auth-gold, #d9a75c); color:#1a100a; font-weight:700; border:none; padding:0.4rem 0.85rem; cursor:pointer;" onclick="window.JulesAuth.openLogin();">Sign In</button>
      `;
    }
  }

  function onAuthStateChanged() {
    renderNavbarAuth();
    syncCheckoutForm();
    window.dispatchEvent(new CustomEvent('jules-auth-changed', { detail: { user: currentUser } }));
  }

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    injectAuthModals();
    renderNavbarAuth();
    syncCheckoutForm();
    apiCheckSession();
  });

  // Public API
  window.JulesAuth = {
    getUser: () => currentUser,
    getToken: () => authToken,
    isLoggedIn: () => !!currentUser,
    login: apiLogin,
    register: apiRegister,
    logout: apiLogout,
    updateProfile: apiUpdateProfile,
    getMyOrders: apiFetchMyOrders,
    openLogin: () => openAuthModal('login'),
    openRegister: () => openAuthModal('register'),
    openOrders: openOrdersModal,
    openProfile: openProfileModal,
    trackOrderInChat: trackOrderInChat
  };
})();
