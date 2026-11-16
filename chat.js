/**
 * ========================================================
 * JULES CAFE — LIVE STAFF & BARISTA CHAT SYSTEM
 * ========================================================
 * Pure real-time customer-to-kitchen barista live support.
 * AI persona completely removed. Rock-solid incremental rendering.
 */

(function () {
  const API_BASE_URL = window.location.protocol.startsWith('http')
    ? `${window.location.origin}/api`
    : 'http://127.0.0.1:5000/api';

  let chatPollInterval = null;
  let chatUnreadPollInterval = null;
  let isSoundEnabled = localStorage.getItem('jules_chat_sound') !== 'muted';
  let isWindowOpen = false;
  let renderedMessageIds = new Set();
  let lastNotifiedStaffMsgId = parseInt(localStorage.getItem('jules_last_notified_staff_id') || '0', 10);

  // --- Web Audio Chime Generator ---
  function playCoffeeChime(type = 'chime') {
    if (!isSoundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'chime') {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now); // E5
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(987.77, now + 0.08); // B5
        gain2.gain.setValueAtTime(0.15, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.45);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.65);
      } else if (type === 'sent') {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      }
    } catch (e) {}
  }

  // --- Session & Identity Helpers ---
  function getCustomerChatSession() {
    let session = localStorage.getItem('jules_chat_session');
    if (!session) {
      let authUser = null;
      try {
        const saved = localStorage.getItem('jules_auth_user');
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {}

      if (authUser && authUser.id) {
        session = `chat-user-${authUser.id}-${Date.now()}`;
      } else {
        session = `chat-guest-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      }
      localStorage.setItem('jules_chat_session', session);
    }
    return session;
  }

  function getCustomerName() {
    let authUser = null;
    try {
      const saved = localStorage.getItem('jules_auth_user');
      if (saved) authUser = JSON.parse(saved);
    } catch (e) {}

    if (authUser && authUser.full_name) {
      return authUser.full_name;
    }
    const legacy = localStorage.getItem('jules_customer_name');
    if (legacy && legacy !== 'Coffee Lover' && legacy !== 'Guest') {
      return legacy;
    }
    return 'Guest';
  }

  function isUserLoggedIn() {
    try {
      const user = localStorage.getItem('jules_auth_user');
      const token = localStorage.getItem('jules_auth_token');
      return !!(user && token);
    } catch (e) {
      return false;
    }
  }

  function updateCustTagUI(name, loggedIn) {
    const custTag = document.getElementById('chat-cust-tag');
    if (!custTag) return;
    if (loggedIn) {
      custTag.title = `Signed in as ${name} (Account verified)`;
      custTag.className = 'chat-cust-tag chat-cust-locked';
      custTag.innerHTML = `
        <i class="fa-solid fa-user-check" style="font-size:0.75rem; color:#d9a75c;"></i>
        <span class="chat-cust-name-text" id="chat-cust-name-text">${escapeHtml(name)}</span>
      `;
    } else {
      const dispName = (name && name !== 'Guest') ? name : 'Guest';
      custTag.title = `Chatting as Guest (Click to change name or sign in)`;
      custTag.className = 'chat-cust-tag chat-cust-guest';
      custTag.innerHTML = `
        <i class="fa-solid fa-circle-user" style="font-size:0.75rem;"></i>
        <span class="chat-cust-name-text" id="chat-cust-name-text">${escapeHtml(dispName)} (Guest)</span>
        <button type="button" class="btn-chat-name-edit" id="btn-edit-guest-name" title="Change your guest name" style="background:none; border:none; color:#d9a75c; cursor:pointer; padding:0 3px; font-size:0.7rem;"><i class="fa-solid fa-pen"></i></button>
      `;
      document.getElementById('btn-edit-guest-name')?.addEventListener('click', (e) => {
        e.stopPropagation();
        promptEditGuestName();
      });
    }
  }

  function promptEditGuestName() {
    const current = getCustomerName() === 'Guest' ? '' : getCustomerName();
    const entered = prompt('What is your name? (Our staff & baristas will see this in live chat):', current);
    if (entered !== null && entered.trim()) {
      setCustomerName(entered.trim());
    }
  }

  function setCustomerName(newName) {
    if (!newName || !newName.trim()) return;
    localStorage.setItem('jules_customer_name', newName.trim());
    updateCustTagUI(newName.trim(), isUserLoggedIn());
  }

  function resetChatForAccount(user, isNewRegistration = false) {
    renderedMessageIds.clear();
    if (user) {
      const newSessionId = `chat-user-${user.id}-${isNewRegistration ? Date.now() : 'main'}`;
      localStorage.setItem('jules_chat_session', newSessionId);
      localStorage.setItem('jules_customer_name', user.full_name);
      updateCustTagUI(user.full_name, true);

      resetMessagesFeed(`
        <div class="chat-system-bubble">
          <i class="fa-solid fa-mug-hot" style="color: #d9a75c; margin-right: 4px;"></i>
          <strong>Welcome to Jules Cafe, ${escapeHtml(user.full_name)}!</strong><br>
          Your live chat with our Communal Road baristas is ready. Message us about your order status, signature drinks, or kitchen requests!
        </div>
      `);

      const badge = document.getElementById('chat-unread-badge');
      if (badge) {
        badge.classList.add('hidden');
        badge.textContent = '0';
      }

      if (isWindowOpen) {
        loadCustomerChatMessages();
      }
    } else {
      localStorage.removeItem('jules_chat_session');
      localStorage.setItem('jules_customer_name', 'Guest');
      updateCustTagUI('Guest', false);

      resetMessagesFeed(`
        <div class="chat-system-bubble">
          <i class="fa-solid fa-mug-hot" style="color: #d9a75c; margin-right: 4px;"></i>
          <strong>Welcome to Jules Cafe Live Support!</strong><br>
          Our kitchen baristas and staff are online. You can chat freely right now as a guest without an account, or sign in anytime!
        </div>
      `);
    }
  }

  function resetMessagesFeed(initialBubbleHtml) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    container.innerHTML = initialBubbleHtml;
    renderedMessageIds.clear();
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

  function formatMessageText(text) {
    if (!text) return '';
    let escaped = escapeHtml(text);
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/(?:^|\n)[•\-]\s*(.*?)(?=\n|$)/g, '<br>• $1');
    escaped = escaped.replace(/\n/g, '<br>');
    return escaped;
  }

  // --- DOM Injection ---
  function injectChatWidgetMarkup() {
    if (document.getElementById('jules-chat-root')) return;

    const existing = document.querySelector('.chat-widget-wrapper');
    if (existing) {
      existing.remove();
    }

    const wrapper = document.createElement('div');
    wrapper.id = 'jules-chat-root';
    wrapper.className = 'chat-widget-wrapper';
    wrapper.innerHTML = `
      <!-- Floating Toast Message Preview -->
      <div class="chat-preview-toast hidden" id="chat-preview-toast">
        <div class="chat-preview-icon"><i class="fa-solid fa-mug-hot"></i></div>
        <div class="chat-preview-content">
          <div class="chat-preview-header">
            <span class="chat-preview-sender" id="chat-preview-sender">Kitchen Barista</span>
            <button type="button" class="chat-preview-close" id="btn-close-toast">&times;</button>
          </div>
          <div class="chat-preview-text" id="chat-preview-text">New message received...</div>
        </div>
      </div>

      <!-- Main Floating Launcher Button -->
      <button type="button" class="btn-floating-chat" id="btn-toggle-chat" title="Chat with Jules Cafe Barista">
        <i class="fa-solid fa-comments"></i>
        <span class="chat-btn-text">Barista Support</span>
        <span class="chat-unread-badge hidden" id="chat-unread-badge">0</span>
      </button>

      <!-- Main Chat Window Box -->
      <div class="chat-window-box hidden" id="chat-window-box">
        <!-- Window Top Header -->
        <div class="chat-window-header">
          <div class="chat-header-info">
            <div class="barista-avatar">
              <i class="fa-solid fa-mug-saucer"></i>
              <span class="barista-status-dot"></span>
            </div>
            <div class="chat-header-text">
              <h4 id="chat-header-title">Jules Cafe Live Support</h4>
              <span class="chat-online-status" id="chat-header-subtitle">
                <i class="fa-solid fa-circle" style="font-size: 0.45rem; vertical-align: middle; color: #2ecc71;"></i> 
                Kitchen Staff • Communal Road
              </span>
            </div>
          </div>

          <div class="chat-header-actions">
            <button type="button" class="chat-header-btn ${isSoundEnabled ? '' : 'muted'}" id="btn-toggle-sound" title="${isSoundEnabled ? 'Mute Notifications' : 'Unmute Notifications'}">
              <i class="fa-solid ${isSoundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}"></i>
            </button>
            <button type="button" class="chat-header-btn" id="btn-clear-chat" title="Clear Conversation">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
            <button type="button" class="chat-header-btn" id="btn-close-chat" title="Minimize Chat">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Secondary Control Bar (Live Status + Verified Customer Tag) -->
        <div class="chat-control-bar">
          <div class="chat-live-status-pill">
            <span class="live-pulse-dot"></span>
            <i class="fa-solid fa-mug-hot"></i>
            <span>Live Kitchen Support</span>
          </div>

          <div class="chat-cust-tag ${isUserLoggedIn() ? 'chat-cust-locked' : 'chat-cust-guest'}" id="chat-cust-tag" title="${isUserLoggedIn() ? 'Account: ' + escapeHtml(getCustomerName()) : 'Click to Sign In / Register'}">
            <i class="fa-solid ${isUserLoggedIn() ? 'fa-user-check' : 'fa-circle-user'}" style="font-size:0.75rem; ${isUserLoggedIn() ? 'color:#d9a75c;' : ''}"></i>
            <span class="chat-cust-name-text" id="chat-cust-name-text">${escapeHtml(getCustomerName())}</span>
          </div>
        </div>

        <!-- Chat Messages Feed -->
        <div class="chat-messages-container" id="chat-messages-container">
          <div class="chat-system-bubble">
            <i class="fa-solid fa-mug-hot" style="color: #d9a75c; margin-right: 4px;"></i>
            <strong>Welcome to Jules Cafe Live Support!</strong><br>
            Our kitchen baristas are online. Message us about your order status, signature drinks, milk options, or pastry availability!
          </div>
        </div>

        <!-- Quick Suggestion Action Chips -->
        <div class="chat-quick-chips" id="chat-quick-chips">
          <button type="button" class="chat-chip" data-prompt="⭐ What are your top bestsellers?">⭐ Bestsellers</button>
          <button type="button" class="chat-chip" data-prompt="📦 Track my order">📦 Track Order</button>
          <button type="button" class="chat-chip" data-prompt="🥛 What milk and dietary options do you have?">🥛 Milk Options</button>
          <button type="button" class="chat-chip" data-prompt="📍 What are your branch location and hours?">📍 Hours & Location</button>
          <button type="button" class="chat-chip" data-prompt="🥐 What pastries do you recommend today?">🥐 Pastries</button>
        </div>

        <!-- Quick Emoji Strip -->
        <div class="chat-emoji-picker hidden" id="chat-emoji-picker">
          <span class="chat-emoji-item" data-emoji="☕">☕</span>
          <span class="chat-emoji-item" data-emoji="🥐">🥐</span>
          <span class="chat-emoji-item" data-emoji="🥤">🥤</span>
          <span class="chat-emoji-item" data-emoji="❤️">❤️</span>
          <span class="chat-emoji-item" data-emoji="🌟">🌟</span>
          <span class="chat-emoji-item" data-emoji="👋">👋</span>
          <span class="chat-emoji-item" data-emoji="✨">✨</span>
        </div>

        <!-- Input Form Bar -->
        <form id="chat-input-form" class="chat-input-form">
          <div class="chat-input-wrapper">
            <input type="text" id="chat-user-message" placeholder="Message our kitchen baristas..." required autocomplete="off">
            <button type="button" class="chat-emoji-trigger" id="btn-toggle-emoji" title="Insert Emoji">
              <i class="fa-regular fa-face-smile"></i>
            </button>
          </div>
          <button type="submit" class="btn-send-chat" id="btn-send-chat" title="Send Message">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(wrapper);
  }

  // --- Append a single message DOM node (incremental, zero DOM wiping) ---
  function appendMessageNode(msg) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const msgKey = String(msg.id || `msg-${Date.now()}-${Math.random()}`);
    if (msg.id && renderedMessageIds.has(String(msg.id))) {
      return;
    }
    renderedMessageIds.add(msgKey);

    const isCustomer = msg.sender === 'customer';
    const timeStr = new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const senderLabel = isCustomer ? 'You' : 'Kitchen Barista';

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isCustomer ? 'customer' : 'staff'}`;
    bubble.setAttribute('data-msg-id', msgKey);

    bubble.innerHTML = `
      ${formatMessageText(msg.message)}
      <span class="chat-bubble-time">
        ${senderLabel} • ${timeStr} 
        ${isCustomer ? '<i class="fa-solid fa-check" style="margin-left:3px; font-size:0.65rem;" title="Delivered to kitchen"></i>' : ''}
      </span>
    `;

    container.appendChild(bubble);
  }

  // --- Initialize Event Listeners & Logic ---
  function initChatSystem() {
    injectChatWidgetMarkup();

    const btnToggle = document.getElementById('btn-toggle-chat');
    const btnClose = document.getElementById('btn-close-chat');
    const box = document.getElementById('chat-window-box');
    const form = document.getElementById('chat-input-form');
    const input = document.getElementById('chat-user-message');
    const btnSound = document.getElementById('btn-toggle-sound');
    const btnClear = document.getElementById('btn-clear-chat');
    const custTag = document.getElementById('chat-cust-tag');
    const btnEmoji = document.getElementById('btn-toggle-emoji');
    const emojiPicker = document.getElementById('chat-emoji-picker');
    const toast = document.getElementById('chat-preview-toast');
    const btnCloseToast = document.getElementById('btn-close-toast');
    const chips = document.querySelectorAll('.chat-chip');

    // Toggle Chat Window
    btnToggle?.addEventListener('click', () => {
      if (box.classList.contains('hidden')) {
        openChatWindow();
      } else {
        closeChatWindow();
      }
    });

    btnClose?.addEventListener('click', closeChatWindow);

    // Toast click opens window
    toast?.addEventListener('click', (e) => {
      if (e.target.closest('#btn-close-toast')) {
        toast.classList.add('hidden');
        return;
      }
      openChatWindow();
    });

    btnCloseToast?.addEventListener('click', (e) => {
      e.stopPropagation();
      toast.classList.add('hidden');
    });

    // Toggle Sound
    btnSound?.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('jules_chat_sound', isSoundEnabled ? 'enabled' : 'muted');
      btnSound.classList.toggle('muted', !isSoundEnabled);
      btnSound.innerHTML = `<i class="fa-solid ${isSoundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}"></i>`;
      btnSound.title = isSoundEnabled ? 'Mute Notifications' : 'Unmute Notifications';
      if (isSoundEnabled) playCoffeeChime('sent');
    });

    // Clear Chat
    btnClear?.addEventListener('click', async () => {
      if (confirm('Would you like to clear this conversation with the baristas and start fresh?')) {
        const sessionId = getCustomerChatSession();
        try {
          await fetch(`${API_BASE_URL}/chat/clear/${sessionId}`, { method: 'POST' });
        } catch (e) {}

        localStorage.removeItem('jules_chat_session');
        resetMessagesFeed(`
          <div class="chat-system-bubble">
            <i class="fa-solid fa-mug-hot" style="color: #d9a75c; margin-right: 4px;"></i>
            <strong>New Conversation Started!</strong><br>
            Hello! How can our kitchen baristas assist you today?
          </div>
        `);
      }
    });

    // Customer Name Click - Opens user account / login modal, or edits guest name
    custTag?.addEventListener('click', (e) => {
      e.preventDefault();
      const authUser = window.JulesAuth?.getUser();
      if (!authUser) {
        const choice = confirm(`You are currently chatting with our staff as "${getCustomerName()}" (Guest).\n\nClick OK to change your guest display name, or Cancel to Sign In / Register.`);
        if (choice) {
          promptEditGuestName();
        } else {
          window.JulesAuth?.openLogin();
        }
      } else {
        window.JulesAuth?.openProfile();
      }
    });

    // Quick Emoji Picker Toggle
    btnEmoji?.addEventListener('click', () => {
      emojiPicker?.classList.toggle('hidden');
    });

    document.querySelectorAll('.chat-emoji-item').forEach(item => {
      item.addEventListener('click', () => {
        const emoji = item.getAttribute('data-emoji');
        if (input) {
          input.value += ` ${emoji} `;
          input.focus();
        }
        emojiPicker?.classList.add('hidden');
      });
    });

    // Quick Chips Click
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt && input) {
          input.value = prompt;
          form?.dispatchEvent(new Event('submit'));
        }
      });
    });

    // Form Submission (Send to Live Staff)
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = (input ? input.value : '').trim();
      if (!text) return;

      const sessionId = getCustomerChatSession();
      const custName = getCustomerName();

      if (input) input.value = '';
      emojiPicker?.classList.add('hidden');

      const tempId = `temp-${Date.now()}`;
      appendMessageNode({
        id: tempId,
        sender: 'customer',
        customer_name: custName,
        message: text,
        created_at: new Date().toISOString()
      });

      playCoffeeChime('sent');

      const container = document.getElementById('chat-messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }

      try {
        const reqHeaders = { 'Content-Type': 'application/json' };
        const authToken = localStorage.getItem('jules_auth_token');
        if (authToken && authToken !== 'null' && authToken !== 'undefined') {
          reqHeaders['X-Auth-Token'] = authToken;
          reqHeaders['Authorization'] = `Bearer ${authToken}`;
        }

        const res = await fetch(`${API_BASE_URL}/chat/send`, {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify({
            session_id: sessionId,
            customer_name: custName,
            sender: 'customer',
            message: text
          })
        });

        const data = await res.json();
        if (data.id) {
          renderedMessageIds.delete(tempId);
          renderedMessageIds.add(String(data.id));
          const tempEl = container?.querySelector(`[data-msg-id="${tempId}"]`);
          if (tempEl) tempEl.setAttribute('data-msg-id', String(data.id));
        }
      } catch (err) {
        console.error("Error sending chat message:", err);
      }
    });

    // Start background unread poll
    startUnreadBackgroundPoll();
  }

  function openChatWindow() {
    const box = document.getElementById('chat-window-box');
    const toast = document.getElementById('chat-preview-toast');
    const input = document.getElementById('chat-user-message');
    const badge = document.getElementById('chat-unread-badge');

    if (!box) return;
    box.classList.remove('hidden');
    isWindowOpen = true;

    if (toast) toast.classList.add('hidden');
    if (badge) {
      badge.classList.add('hidden');
      badge.textContent = '0';
    }

    markMessagesAsRead();
    loadCustomerChatMessages();

    if (chatPollInterval) clearInterval(chatPollInterval);
    chatPollInterval = setInterval(loadCustomerChatMessages, 3000);

    setTimeout(() => {
      if (input) input.focus();
    }, 200);
  }

  function closeChatWindow() {
    const box = document.getElementById('chat-window-box');
    if (box) box.classList.add('hidden');
    isWindowOpen = false;

    if (chatPollInterval) {
      clearInterval(chatPollInterval);
      chatPollInterval = null;
    }
  }

  async function markMessagesAsRead() {
    const sessionId = getCustomerChatSession();
    try {
      await fetch(`${API_BASE_URL}/chat/customer-read/${sessionId}`, { method: 'PUT' });
    } catch (e) {}
  }

  // --- Smooth Incremental Message Loader (Zero DOM wipe, Zero jitter) ---
  async function loadCustomerChatMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const sessionId = getCustomerChatSession();
    try {
      const res = await fetch(`${API_BASE_URL}/chat/messages/${sessionId}`);
      if (!res.ok) return;

      const messages = await res.json();
      if (!Array.isArray(messages)) return;

      // Filter out any leftover assistant messages
      const validMessages = messages.filter(m => m.sender !== 'assistant');

      // Check if there are any new messages that haven't been rendered yet
      const newMessages = validMessages.filter(m => !renderedMessageIds.has(String(m.id)));

      if (newMessages.length === 0) {
        return; // ZERO DOM touch when nothing changed! Perfectly smooth.
      }

      // Check if user is scrolled near bottom
      const wasNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;

      let hasStaffMessage = false;
      newMessages.forEach(m => {
        appendMessageNode(m);
        if (m.sender === 'staff') {
          hasStaffMessage = true;
          if (m.id > lastNotifiedStaffMsgId) {
            lastNotifiedStaffMsgId = m.id;
            localStorage.setItem('jules_last_notified_staff_id', String(lastNotifiedStaffMsgId));
          }
        }
      });

      if (hasStaffMessage && isWindowOpen) {
        playCoffeeChime('chime');
        markMessagesAsRead();
      }

      if (wasNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      console.error("Error loading chat messages:", err);
    }
  }

  // --- Background Unread Polling (Runs only when window closed) ---
  function startUnreadBackgroundPoll() {
    if (chatUnreadPollInterval) clearInterval(chatUnreadPollInterval);

    const checkUnread = async () => {
      if (isWindowOpen) return;
      const sessionId = getCustomerChatSession();
      try {
        const res = await fetch(`${API_BASE_URL}/chat/unread-count/${sessionId}`);
        if (!res.ok) return;

        const data = await res.json();
        const badge = document.getElementById('chat-unread-badge');
        const toast = document.getElementById('chat-preview-toast');
        const previewText = document.getElementById('chat-preview-text');
        const previewSender = document.getElementById('chat-preview-sender');

        if (data.unread_count > 0) {
          if (badge) {
            badge.textContent = data.unread_count;
            badge.classList.remove('hidden');
          }

          // Only notify if there is a NEW staff message ID we haven't seen yet!
          if (data.last_id && data.last_id > lastNotifiedStaffMsgId) {
            lastNotifiedStaffMsgId = data.last_id;
            localStorage.setItem('jules_last_notified_staff_id', String(lastNotifiedStaffMsgId));

            if (previewSender) previewSender.textContent = 'Kitchen Barista';
            if (previewText) previewText.textContent = data.last_message;
            if (toast) {
              toast.classList.remove('hidden');
              playCoffeeChime('chime');
            }
          }
        } else {
          if (badge) badge.classList.add('hidden');
          if (toast) toast.classList.add('hidden');
        }
      } catch (e) {}
    };

    chatUnreadPollInterval = setInterval(checkUnread, 5000);
    setTimeout(checkUnread, 1500);
  }

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatSystem);
  } else {
    initChatSystem();
  }

  // Expose global controller
  window.JulesChat = {
    open: openChatWindow,
    close: closeChatWindow,
    sendMessage: (text) => {
      const input = document.getElementById('chat-user-message');
      const form = document.getElementById('chat-input-form');
      if (input && form) {
        input.value = text;
        form.dispatchEvent(new Event('submit'));
      }
    },
    setCustomerName: setCustomerName,
    resetChatForAccount: resetChatForAccount
  };

  window.initCustomerChat = initChatSystem;
  window.loadCustomerChatMessages = loadCustomerChatMessages;
})();
