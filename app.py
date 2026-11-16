import os
import re
import uuid
import hashlib
import json
import urllib.request
from functools import wraps
# pyrefly: ignore [missing-import]
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from init_db import init_db
from mongo_db import get_db, get_next_sequence, get_db_status, now_str

def load_env_file():
    for filename in ['.env', '.env.example']:
        env_path = os.path.join(os.path.dirname(__file__), filename)
        if os.path.exists(env_path):
            try:
                with open(env_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            k, v = line.split('=', 1)
                            val = v.strip().strip('"').strip("'")
                            if val:
                                os.environ[k.strip()] = val
            except Exception:
                pass

load_env_file()

def hash_password(password: str) -> str:
    salt = "jules_cafe_secret_salt_2026"
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()

def check_password_hash(stored_hash: str, password: str) -> bool:
    return hash_password(password) == stored_hash

def generate_password_hash(password: str) -> str:
    return hash_password(password)


app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get('Origin', '*')
    response.headers['Access-Control-Allow-Origin'] = origin if origin != '*' else '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Auth-Token'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    return jsonify({'status': 'ok'}), 200

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/admin')
@app.route('/admin.html')
def serve_admin():
    return send_from_directory('.', 'admin.html')

@app.route('/orderonline')
@app.route('/orderonline.html')
def serve_orderonline():
    return send_from_directory('.', 'orderonline.html')

@app.route('/<path:filename>')
def serve_static(filename):
    file_path = os.path.join(os.path.dirname(__file__), filename)
    if os.path.isfile(file_path):
        return send_from_directory('.', filename)
    return send_from_directory('.', 'index.html')


# In-memory session cache (token -> user dictionary)
SESSIONS = {}

def ensure_db_schema():
    """Ensure MongoDB collections, indexes, and migrated/seeded documents are initialized."""
    try:
        init_db()
    except Exception as e:
        print(f"[MongoDB Init Warning] {e}")

ensure_db_schema()

@app.route('/api/db/status', methods=['GET'])
def api_db_status():
    return jsonify(get_db_status())

@app.route('/api/categories', methods=['GET'])
def api_get_categories():
    db = get_db()
    cats = list(db.categories.find({}, {'_id': 0}).sort('id', 1))
    return jsonify(cats)

@app.route('/api/db/collection/<coll_name>', methods=['GET'])
def api_db_collection(coll_name):
    allowed = [
        'categories',
        'menu_items',
        'menu_item_sizes',
        'users',
        'user_sessions',
        'orders',
        'order_items',
        'order_item_options',
        'chat_sessions',
        'chat_messages',
        'reviews',
        'loyalty_members'
    ]
    if coll_name not in allowed:
        return jsonify({'error': f'Invalid collection. Choose from {allowed}'}), 400
    db = get_db()
    docs = list(db[coll_name].find({}, {'_id': 0}).sort('id', -1).limit(200))
    return jsonify({'collection': coll_name, 'count': len(docs), 'documents': docs})

@app.route('/mongo-viewer')
def serve_mongo_viewer():
    html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Jules Cafe — MongoDB & 3NF Normalization Explorer</title>
  <style>
    :root { --bg:#0f172a; --card:#1e293b; --accent:#10b981; --accent2:#38bdf8; --text:#f8fafc; --muted:#94a3b8; --border:#334155; }
    * { box-sizing:border-box; margin:0; padding:0; font-family:'Segoe UI',system-ui,sans-serif; }
    body { background:var(--bg); color:var(--text); padding:24px; }
    .header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border); }
    .badge { background:rgba(16,185,129,0.15); color:var(--accent); border:1px solid var(--accent); padding:6px 14px; border-radius:999px; font-weight:600; font-size:0.85rem; }
    .norm-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:14px; margin-bottom:20px; }
    .norm-card { background:var(--card); border:1px solid var(--border); border-left:4px solid var(--accent2); border-radius:10px; padding:14px 16px; }
    .norm-card h4 { color:var(--accent2); margin-bottom:6px; font-size:0.95rem; }
    .norm-card p { color:var(--muted); font-size:0.83rem; line-height:1.45; }
    .norm-card code { color:#f8fafc; background:#0f172a; padding:1px 5px; border-radius:4px; font-size:0.8rem; }
    .grid { display:grid; grid-template-columns:280px 1fr; gap:20px; }
    .sidebar { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:16px; height:fit-content; }
    .sidebar h3 { font-size:0.82rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); margin-bottom:10px; }
    .coll-btn { width:100%; display:flex; justify-content:space-between; align-items:center; background:transparent; color:var(--text); border:1px solid transparent; padding:9px 12px; border-radius:8px; cursor:pointer; text-align:left; font-size:0.9rem; margin-bottom:5px; transition:0.15s; }
    .coll-btn:hover, .coll-btn.active { background:rgba(16,185,129,0.14); border-color:var(--accent); color:#fff; }
    .count-pill { background:#0f172a; color:var(--accent); padding:2px 8px; border-radius:999px; font-size:0.75rem; font-weight:600; }
    .main { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:20px; overflow:auto; max-height:76vh; }
    .fk-note { color:var(--accent2); font-size:0.85rem; margin-bottom:12px; }
    pre { background:#0b1120; padding:16px; border-radius:8px; border:1px solid var(--border); color:#a7f3d0; overflow:auto; font-family:Consolas,monospace; font-size:0.85rem; line-height:1.5; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>🍃 Jules Cafe — MongoDB & 3NF Normalization Explorer</h1>
      <p id="conn-info" style="color:var(--muted);margin-top:4px;">Loading MongoDB connection status...</p>
    </div>
    <span id="live-badge" class="badge">Connecting...</span>
  </div>
  <div class="norm-cards">
    <div class="norm-card">
      <h4>1NF — Atomic Values & No Repeating Groups</h4>
      <p>• Multi-size prices extracted into <code>menu_item_sizes</code> (<code>menu_item_id</code>, <code>size_label</code>, <code>price</code>).<br>• Multi-valued drink customizations extracted into <code>order_item_options</code> (<code>order_item_id</code>, <code>option_value</code>).</p>
    </div>
    <div class="norm-card">
      <h4>2NF — Full Functional Dependency on Primary Key</h4>
      <p>• Order header attributes live in <code>orders</code> (PK: <code>id</code>), while line quantities & unit prices live in <code>order_items</code> (FK: <code>order_id</code>, <code>menu_item_id</code>).</p>
    </div>
    <div class="norm-card">
      <h4>3NF — Zero Transitive Dependencies</h4>
      <p>• Menu categories normalized into <code>categories</code> (linked via <code>menu_items.category_id</code>).<br>• Chat sessions normalized into <code>chat_sessions</code> (PK: <code>session_id</code>).<br>• Auth tokens isolated in <code>user_sessions</code> (FK: <code>user_id</code>).</p>
    </div>
  </div>
  <div class="grid">
    <div class="sidebar">
      <h3>Normalized 3NF Collections</h3>
      <div id="coll-list"></div>
    </div>
    <div class="main">
      <h2 id="coll-title" style="margin-bottom:4px;">Select a collection</h2>
      <div id="coll-fk" class="fk-note"></div>
      <pre id="doc-viewer">Loading documents...</pre>
    </div>
  </div>
  <script>
    const FK_DESCRIPTIONS = {
      categories: "3NF Lookup Table — PK: id ('cat-espresso', 'cat-milk', 'cat-frappe', 'cat-quickbites')",
      menu_items: "3NF Entity — PK: id | FK: category_id → categories.id",
      menu_item_sizes: "1NF/3NF Atomic Size Pricing — PK: id | FK: menu_item_id → menu_items.id",
      users: "3NF User Accounts — PK: id (Unique: username)",
      user_sessions: "3NF Session Tokens — PK: token | FK: user_id → users.id",
      orders: "2NF/3NF Order Header (+ NoSQL embedded items) — PK: id | FK: user_id → users.id",
      order_items: "2NF/3NF Order Line Items — PK: id | FK: order_id → orders.id, menu_item_id → menu_items.id",
      order_item_options: "1NF Atomic Drink Customizations — PK: id | FK: order_item_id → order_items.id",
      chat_sessions: "3NF Chat Session Header — PK: session_id | FK: user_id → users.id",
      chat_messages: "3NF Chat Messages — PK: id | FK: session_id → chat_sessions.session_id",
      reviews: "3NF Customer Reviews — PK: id",
      loyalty_members: "3NF Loyalty Points — PK: id | FK: user_id → users.id"
    };
    async function init() {
      const res = await fetch('/api/db/status');
      const status = await res.json();
      document.getElementById('conn-info').textContent = `URI: ${status.uri} | Database: ${status.database_name}`;
      document.getElementById('live-badge').textContent = status.live_mongod_connected ? '● Connected to Live mongod (Port 27017)' : '● Local MongoDB Document Store';
      const list = document.getElementById('coll-list');
      list.innerHTML = '';
      const entries = Object.entries(status.collections);
      entries.forEach(([name, count], idx) => {
        const btn = document.createElement('button');
        btn.className = 'coll-btn' + (idx === 0 ? ' active' : '');
        btn.innerHTML = `<span>${name}</span><span class="count-pill">${count}</span>`;
        btn.onclick = () => {
          document.querySelectorAll('.coll-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          loadCollection(name);
        };
        list.appendChild(btn);
      });
      if (entries.length) loadCollection(entries[0][0]);
    }
    async function loadCollection(name) {
      document.getElementById('coll-title').textContent = `Collection: db.${name}`;
      document.getElementById('coll-fk').textContent = FK_DESCRIPTIONS[name] || '';
      document.getElementById('doc-viewer').textContent = 'Fetching documents...';
      const res = await fetch(`/api/db/collection/${name}`);
      const data = await res.json();
      document.getElementById('doc-viewer').textContent = JSON.stringify(data.documents, null, 2);
    }
    init();
  </script>
</body>
</html>"""
    return html, 200, {'Content-Type': 'text/html; charset=utf-8'}

def get_current_user():
    token = request.headers.get('X-Auth-Token', '')
    auth_header = request.headers.get('Authorization', '')
    if not token and auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1]
    token = token.strip()
    if not token or token == 'null' or token == 'undefined':
        return None

    if token in SESSIONS:
        return SESSIONS[token]

    try:
        db = get_db()
        sess = db.user_sessions.find_one({'token': token})
        if sess:
            row = db.users.find_one({'id': int(sess['user_id'])})
            if row:
                user_info = {
                    'id': row['id'],
                    'username': row['username'],
                    'full_name': row['full_name'],
                    'role': row['role'],
                    'email': row.get('email') or '',
                    'phone': row.get('phone') or '',
                    'delivery_address': row.get('delivery_address') or ''
                }
                SESSIONS[token] = user_info
                return user_info
    except Exception as e:
        print(f"[get_current_user error] {e}")

    return None

def require_auth(roles=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = get_current_user()
            if not user:
                return jsonify({'error': 'Unauthorized access. Please log in.'}), 401
            if roles and user['role'] not in roles:
                return jsonify({'error': f'Forbidden access. Role "{user["role"]}" is not authorized.'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

# ==========================================
# AUTHENTICATION & REGISTRATION ENDPOINTS
# ==========================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    delivery_address = data.get('delivery_address', '').strip()
    role = data.get('role', 'customer').strip()

    if not username:
        return jsonify({'error': 'Username is required'}), 400
    if len(username) < 3:
        return jsonify({'error': 'Username must be at least 3 characters long'}), 400
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    if len(password) < 4:
        return jsonify({'error': 'Password must be at least 4 characters long'}), 400
    if not full_name:
        return jsonify({'error': 'Full name is required'}), 400

    if role not in ['customer', 'staff', 'employee', 'admin']:
        role = 'customer'

    db = get_db()

    existing_user = db.users.find_one({'username': {'$regex': f'^{re.escape(username)}$', '$options': 'i'}})
    if existing_user:
        return jsonify({'error': f'Username "{username}" is already taken. Please choose another.'}), 400

    if email:
        existing_email = db.users.find_one({'email': {'$regex': f'^{re.escape(email)}$', '$options': 'i'}})
        if existing_email:
            return jsonify({'error': f'An account with email "{email}" already exists.'}), 400

    pw_hash = generate_password_hash(password)
    user_id = get_next_sequence('users')
    db.users.insert_one({
        'id': user_id,
        'username': username,
        'password_hash': pw_hash,
        'full_name': full_name,
        'role': role,
        'email': email,
        'phone': phone,
        'delivery_address': delivery_address,
        'created_at': now_str()
    })

    token = str(uuid.uuid4())
    db.user_sessions.replace_one(
        {'token': token},
        {'token': token, 'user_id': user_id, 'created_at': now_str()},
        upsert=True
    )

    user_info = {
        'id': user_id,
        'username': username,
        'full_name': full_name,
        'role': role,
        'email': email,
        'phone': phone,
        'delivery_address': delivery_address
    }
    SESSIONS[token] = user_info

    return jsonify({
        'success': True,
        'token': token,
        'user': user_info,
        'message': f'Welcome to Jules Cafe, {full_name}! Account created successfully.'
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username_or_email = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username_or_email or not password:
        return jsonify({'error': 'Username/email and password are required'}), 400

    db = get_db()
    pattern = {'$regex': f'^{re.escape(username_or_email)}$', '$options': 'i'}
    user = db.users.find_one({'$or': [{'username': pattern}, {'email': pattern}]})

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid username or password'}), 401

    token = str(uuid.uuid4())
    db.user_sessions.replace_one(
        {'token': token},
        {'token': token, 'user_id': user['id'], 'created_at': now_str()},
        upsert=True
    )

    user_info = {
        'id': user['id'],
        'username': user['username'],
        'full_name': user['full_name'],
        'role': user['role'],
        'email': user.get('email') or '',
        'phone': user.get('phone') or '',
        'delivery_address': user.get('delivery_address') or ''
    }
    SESSIONS[token] = user_info

    return jsonify({
        'success': True,
        'token': token,
        'user': user_info,
        'message': f'Logged in successfully as {user["full_name"]} ({user["role"].upper()})'
    })

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    token = request.headers.get('X-Auth-Token', '')
    auth_header = request.headers.get('Authorization', '')
    if not token and auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1]
    token = token.strip()

    if token:
        if token in SESSIONS:
            del SESSIONS[token]
        try:
            db = get_db()
            db.user_sessions.delete_one({'token': token})
        except Exception:
            pass

    return jsonify({'success': True, 'message': 'Logged out successfully'})

@app.route('/api/auth/me', methods=['GET'])
def get_me():
    user = get_current_user()
    if not user:
        return jsonify({'authenticated': False}), 401
    return jsonify({'authenticated': True, 'user': user})

@app.route('/api/auth/profile', methods=['GET'])
def get_profile():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized. Please log in.'}), 401

    db = get_db()
    row = db.users.find_one({'id': int(user['id'])})
    if not row:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': row['id'],
        'username': row['username'],
        'full_name': row['full_name'],
        'role': row['role'],
        'email': row.get('email') or '',
        'phone': row.get('phone') or '',
        'delivery_address': row.get('delivery_address') or '',
        'created_at': row.get('created_at') or ''
    })

@app.route('/api/auth/profile', methods=['PUT'])
def update_profile():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized. Please log in.'}), 401

    data = request.get_json() or {}
    full_name = data.get('full_name', '').strip() or user['full_name']
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    delivery_address = data.get('delivery_address', '').strip()

    db = get_db()

    if email:
        existing = db.users.find_one({
            'email': {'$regex': f'^{re.escape(email)}$', '$options': 'i'},
            'id': {'$ne': int(user['id'])}
        })
        if existing:
            return jsonify({'error': f'Email "{email}" is already in use by another account.'}), 400

    new_password = data.get('new_password', '').strip()
    current_password = data.get('current_password', '').strip()

    update_fields = {
        'full_name': full_name,
        'email': email,
        'phone': phone,
        'delivery_address': delivery_address
    }

    if new_password:
        if len(new_password) < 4:
            return jsonify({'error': 'New password must be at least 4 characters long'}), 400
        row = db.users.find_one({'id': int(user['id'])})
        if not row or not check_password_hash(row['password_hash'], current_password):
            return jsonify({'error': 'Current password is incorrect'}), 400
        update_fields['password_hash'] = generate_password_hash(new_password)

    db.users.update_one({'id': int(user['id'])}, {'$set': update_fields})

    user['full_name'] = full_name
    user['email'] = email
    user['phone'] = phone
    user['delivery_address'] = delivery_address

    return jsonify({
        'success': True,
        'user': user,
        'message': 'Profile updated successfully.'
    })

@app.route('/api/customer/orders', methods=['GET'])
def get_customer_orders():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized. Please log in to view your orders.'}), 401

    db = get_db()
    query_or = [{'user_id': int(user['id'])}]
    if user['full_name'] and user['full_name'] != 'Guest':
        query_or.append({'customer_name': user['full_name']})

    orders = list(db.orders.find({'$or': query_or}).sort('id', -1))

    orders_list = []
    for order in orders:
        items = list(db.order_items.find({'order_id': order['id']}))
        if not items and isinstance(order.get('items'), list):
            items = order['items']
        item_list = []
        for it in items:
            item_list.append({
                'item_name': it['item_name'],
                'custom_options': it.get('custom_options') or '',
                'unit_price': it['unit_price'],
                'quantity': it['quantity']
            })
        orders_list.append({
            'id': order['id'],
            'customer_name': order['customer_name'],
            'fulfillment_mode': order['fulfillment_mode'],
            'status': order.get('status') or 'Pending',
            'subtotal': order['subtotal'],
            'tax': order['tax'],
            'total': order['total'],
            'delivery_address': order.get('delivery_address') or '',
            'delivery_notes': order.get('delivery_notes') or '',
            'payment_method': order.get('payment_method') or 'Cash',
            'payment_status': order.get('payment_status') or 'Pending',
            'created_at': order.get('created_at') or '',
            'items': item_list
        })
    return jsonify(orders_list)

# ==========================================
# MENU CRUD ENDPOINTS
# ==========================================

@app.route('/api/menu', methods=['GET'])
def get_menu():
    db = get_db()
    items = list(db.menu_items.find({}).sort([('category', 1), ('id', 1)]))

    menu_list = []
    for item in items:
        has_sz = bool(item.get('has_sizes'))
        menu_list.append({
            'id': item['id'],
            'category': item['category'],
            'name': item['name'],
            'desc': item.get('desc') or '',
            'basePrice': item['base_price'],
            'price8oz': item['price_8oz'] if item.get('price_8oz') is not None else (item['base_price'] if has_sz and item['category'] != 'frappe' else None),
            'price12oz': item['price_12oz'] if item.get('price_12oz') is not None else (item['base_price'] if has_sz else None),
            'price16oz': item['price_16oz'] if item.get('price_16oz') is not None else (item['base_price'] if has_sz else None),
            'hasSizes': has_sz,
            'hasMilk': bool(item.get('has_milk')),
            'hasSyrups': bool(item.get('has_syrups')),
            'hasExtraShot': bool(item.get('has_extra_shot')),
            'pairingRecommendation': item.get('pairing_recommendation') or '',
            'isAvailable': bool(item.get('is_available', 1))
        })
    return jsonify(menu_list)

@app.route('/api/menu', methods=['POST'])
@require_auth(roles=['admin', 'staff'])
def create_menu_item():
    data = request.get_json() or {}
    
    item_id = data.get('id', '').strip() or f"custom-{uuid.uuid4().hex[:6]}"
    category = data.get('category', 'espresso').strip()
    name = data.get('name', '').strip()
    desc = data.get('desc', '').strip()
    base_price = float(data.get('basePrice', 0))
    price_8oz = float(data.get('price8oz')) if data.get('price8oz') is not None else base_price
    price_12oz = float(data.get('price12oz')) if data.get('price12oz') is not None else base_price
    price_16oz = float(data.get('price16oz')) if data.get('price16oz') is not None else base_price
    has_sizes = 1 if data.get('hasSizes') else 0
    has_milk = 1 if data.get('hasMilk') else 0
    has_syrups = 1 if data.get('hasSyrups') else 0
    has_extra_shot = 1 if data.get('hasExtraShot') else 0
    pairing_recommendation = data.get('pairingRecommendation', '').strip()

    if not name:
        return jsonify({'error': 'Menu item name is required'}), 400

    db = get_db()

    # Check if ID already exists
    existing = db.menu_items.find_one({'id': item_id})
    if existing:
        return jsonify({'error': f'Item ID "{item_id}" already exists.'}), 400

    db.menu_items.insert_one({
        'id': item_id,
        'category': category,
        'name': name,
        'desc': desc,
        'base_price': base_price,
        'price_8oz': price_8oz,
        'price_12oz': price_12oz,
        'price_16oz': price_16oz,
        'has_sizes': has_sizes,
        'has_milk': has_milk,
        'has_syrups': has_syrups,
        'has_extra_shot': has_extra_shot,
        'pairing_recommendation': pairing_recommendation,
        'is_available': 1
    })

    return jsonify({'success': True, 'id': item_id, 'message': f'Menu item "{name}" created successfully.'}), 201

@app.route('/api/menu/<item_id>', methods=['PUT'])
@require_auth(roles=['admin', 'staff'])
def update_menu_item(item_id):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    category = data.get('category', '').strip()
    desc = data.get('desc', '').strip()
    base_price = float(data.get('basePrice', 0))
    price_8oz = float(data.get('price8oz')) if data.get('price8oz') is not None else base_price
    price_12oz = float(data.get('price12oz')) if data.get('price12oz') is not None else base_price
    price_16oz = float(data.get('price16oz')) if data.get('price16oz') is not None else base_price
    has_sizes = 1 if data.get('hasSizes') else 0
    has_milk = 1 if data.get('hasMilk') else 0
    has_syrups = 1 if data.get('hasSyrups') else 0
    has_extra_shot = 1 if data.get('hasExtraShot') else 0
    pairing_recommendation = data.get('pairingRecommendation', '').strip()

    if not name:
        return jsonify({'error': 'Menu item name is required'}), 400

    db = get_db()
    existing = db.menu_items.find_one({'id': item_id})
    if not existing:
        return jsonify({'error': 'Menu item not found'}), 404

    db.menu_items.update_one(
        {'id': item_id},
        {'$set': {
            'category': category,
            'name': name,
            'desc': desc,
            'base_price': base_price,
            'price_8oz': price_8oz,
            'price_12oz': price_12oz,
            'price_16oz': price_16oz,
            'has_sizes': has_sizes,
            'has_milk': has_milk,
            'has_syrups': has_syrups,
            'has_extra_shot': has_extra_shot,
            'pairing_recommendation': pairing_recommendation
        }}
    )

    return jsonify({'success': True, 'message': f'Menu item "{name}" updated successfully.'})

@app.route('/api/menu/<item_id>/stock', methods=['PUT'])
@require_auth(roles=['admin', 'staff'])
def toggle_menu_item_stock(item_id):
    data = request.get_json() or {}
    is_available = 1 if data.get('isAvailable', True) else 0

    db = get_db()
    item = db.menu_items.find_one({'id': item_id})
    if not item:
        return jsonify({'error': 'Menu item not found'}), 404

    db.menu_items.update_one({'id': item_id}, {'$set': {'is_available': is_available}})

    status_str = "In Stock" if is_available else "Out of Stock"
    return jsonify({'success': True, 'isAvailable': bool(is_available), 'message': f'"{item["name"]}" is now {status_str}'})

@app.route('/api/menu/<item_id>', methods=['DELETE'])
@require_auth(roles=['admin', 'staff'])
def delete_menu_item(item_id):
    db = get_db()
    existing = db.menu_items.find_one({'id': item_id})
    if not existing:
        return jsonify({'error': 'Menu item not found'}), 404

    item_name = existing['name']
    db.menu_items.delete_one({'id': item_id})

    return jsonify({'success': True, 'message': f'Menu item "{item_name}" deleted.'})

# ==========================================
# ORDERS CRUD & STATUS ENDPOINTS
# ==========================================

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    customer_name = data.get('customer_name', '').strip() or 'Guest'
    fulfillment_mode = data.get('fulfillment_mode', 'pickup')
    contact_info = data.get('contact_info', '')
    cart = data.get('cart', [])
    try:
        subtotal = float(data.get('subtotal', 0.0))
        tax = float(data.get('tax', 0.0))
        total = float(data.get('total', 0.0))
    except (ValueError, TypeError):
        subtotal, tax, total = 0.0, 0.0, 0.0
    status = data.get('status', 'Pending')
    delivery_address = data.get('delivery_address', '')
    delivery_lat = data.get('delivery_lat')
    delivery_lng = data.get('delivery_lng')
    delivery_maps_url = data.get('delivery_maps_url', '').strip()
    delivery_notes = data.get('delivery_notes', '')
    payment_method = data.get('payment_method', 'Cash')
    payment_reference = data.get('payment_reference', '').strip()
    payment_status = data.get('payment_status', 'Pending Verification' if payment_method == 'GCash' else 'Pending')
    payment_receipt = data.get('payment_receipt', '').strip()

    if not cart or not isinstance(cart, list) or len(cart) == 0:
        return jsonify({'error': 'Cart is empty. Please add items before checking out.'}), 400

    curr_user = get_current_user()
    user_id = curr_user['id'] if curr_user else None

    if curr_user and (customer_name == 'Guest' or not customer_name):
        customer_name = curr_user['full_name']

    # Auto construct Google Maps navigation URL if empty
    if fulfillment_mode == 'delivery':
        if not delivery_maps_url and delivery_lat and delivery_lng:
            delivery_maps_url = f"https://www.google.com/maps/dir/?api=1&origin=7.1420,125.6265&destination={delivery_lat},{delivery_lng}"
        elif not delivery_maps_url and delivery_address:
            import urllib.parse
            delivery_maps_url = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(delivery_address)}"

    db = get_db()
    order_id = get_next_sequence('orders')
    created_ts = now_str()

    all_menu = list(db.menu_items.find({}))
    menu_by_name = {m['name'].lower(): m['id'] for m in all_menu}

    embedded_items = []
    for item in cart:
        oi_id = get_next_sequence('order_items')
        raw_name = item.get('name', 'Unknown Item')
        menu_item_id = item.get('id')
        if not menu_item_id:
            low_n = raw_name.lower()
            menu_item_id = menu_by_name.get(low_n)
            if not menu_item_id:
                for m_n, m_id in menu_by_name.items():
                    if m_n in low_n:
                        menu_item_id = m_id
                        break

        custom_opts_str = item.get('customText', '')
        oi_doc = {
            'id': oi_id,
            'order_id': order_id,
            'menu_item_id': menu_item_id,
            'item_name': raw_name,
            'custom_options': custom_opts_str,
            'unit_price': float(item.get('price', 0.0) or 0.0),
            'quantity': int(item.get('qty', 1) or 1)
        }
        db.order_items.insert_one(oi_doc)

        # Normalize atomic options into order_item_options (1NF)
        if custom_opts_str:
            parts = [p.strip() for p in custom_opts_str.replace('|', ',').split(',') if p.strip()]
            for part in parts:
                opt_id = get_next_sequence('order_item_options')
                db.order_item_options.insert_one({
                    'id': opt_id,
                    'order_item_id': oi_id,
                    'option_value': part
                })

        embedded_items.append({
            'id': oi_id,
            'menu_item_id': menu_item_id,
            'item_name': oi_doc['item_name'],
            'custom_options': oi_doc['custom_options'],
            'unit_price': oi_doc['unit_price'],
            'quantity': oi_doc['quantity']
        })

    db.orders.insert_one({
        'id': order_id,
        'customer_name': customer_name,
        'fulfillment_mode': fulfillment_mode,
        'contact_info': contact_info,
        'subtotal': subtotal,
        'tax': tax,
        'total': total,
        'status': status,
        'delivery_address': delivery_address,
        'delivery_lat': delivery_lat,
        'delivery_lng': delivery_lng,
        'delivery_maps_url': delivery_maps_url,
        'delivery_notes': delivery_notes,
        'payment_method': payment_method,
        'payment_reference': payment_reference,
        'payment_status': payment_status,
        'payment_receipt': payment_receipt,
        'user_id': user_id,
        'created_at': created_ts,
        'items': embedded_items
    })

    return jsonify({
        'success': True,
        'order_id': order_id,
        'customer_name': customer_name,
        'fulfillment_mode': fulfillment_mode,
        'delivery_maps_url': delivery_maps_url,
        'payment_method': payment_method,
        'payment_status': payment_status,
        'message': 'Order successfully recorded in database'
    }), 201

@app.route('/api/orders', methods=['GET'])
@require_auth(roles=['admin', 'staff', 'employee'])
def get_orders():
    db = get_db()
    orders = list(db.orders.find({}).sort('id', -1))
    
    result = []
    for order in orders:
        items = list(db.order_items.find({'order_id': order['id']}))
        if not items and isinstance(order.get('items'), list):
            items = order['items']
        item_list = []
        for item in items:
            item_list.append({
                'id': item.get('id'),
                'item_name': item['item_name'],
                'custom_options': item.get('custom_options') or '',
                'unit_price': item['unit_price'],
                'quantity': item['quantity']
            })
        
        status_val = order.get('status') or 'Pending'
        
        # Delivery fields
        del_addr = order.get('delivery_address') or ''
        del_lat = order.get('delivery_lat')
        del_lng = order.get('delivery_lng')
        del_maps = order.get('delivery_maps_url') or ''
        del_notes = order.get('delivery_notes') or ''

        # Payment fields
        pay_method = order.get('payment_method') or 'Cash'
        pay_ref = order.get('payment_reference') or ''
        pay_status = order.get('payment_status') or ('Pending Verification' if pay_method == 'GCash' else 'Pending')
        pay_receipt = order.get('payment_receipt') or ''

        # Auto construct Google Maps navigation URL if lat/lng exists and url is empty
        if not del_maps and del_lat and del_lng:
            del_maps = f"https://www.google.com/maps/dir/?api=1&origin=7.1420,125.6265&destination={del_lat},{del_lng}"

        result.append({
            'id': order['id'],
            'customer_name': order['customer_name'],
            'fulfillment_mode': order['fulfillment_mode'],
            'contact_info': order.get('contact_info') or '',
            'subtotal': order['subtotal'],
            'tax': order['tax'],
            'total': order['total'],
            'status': status_val,
            'delivery_address': del_addr,
            'delivery_lat': del_lat,
            'delivery_lng': del_lng,
            'delivery_maps_url': del_maps,
            'delivery_notes': del_notes,
            'payment_method': pay_method,
            'payment_reference': pay_ref,
            'payment_status': pay_status,
            'payment_receipt': pay_receipt,
            'created_at': order.get('created_at') or '',
            'items': item_list
        })
    return jsonify(result)

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
@require_auth(roles=['admin', 'staff', 'employee'])
def update_order_status(order_id):
    data = request.get_json() or {}
    new_status = data.get('status', '').strip()

    valid_statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of {valid_statuses}'}), 400

    db = get_db()
    existing = db.orders.find_one({'id': order_id})
    if not existing:
        return jsonify({'error': 'Order not found'}), 404

    db.orders.update_one({'id': order_id}, {'$set': {'status': new_status}})

    return jsonify({'success': True, 'message': f'Order #{order_id} status updated to "{new_status}".'})

@app.route('/api/orders/<int:order_id>/payment', methods=['PUT'])
@require_auth(roles=['admin', 'staff', 'employee'])
def update_order_payment(order_id):
    data = request.get_json() or {}
    payment_status = data.get('payment_status', '').strip()
    payment_reference = data.get('payment_reference')

    if not payment_status:
        return jsonify({'error': 'payment_status is required'}), 400

    db = get_db()
    existing = db.orders.find_one({'id': order_id})
    if not existing:
        return jsonify({'error': 'Order not found'}), 404

    update_fields = {'payment_status': payment_status}
    if payment_reference is not None:
        update_fields['payment_reference'] = payment_reference.strip()
    db.orders.update_one({'id': order_id}, {'$set': update_fields})

    return jsonify({'success': True, 'message': f'Order #{order_id} payment status set to "{payment_status}".'})

@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
@require_auth(roles=['admin', 'staff'])
def delete_order(order_id):
    db = get_db()
    existing = db.orders.find_one({'id': order_id})
    if not existing:
        return jsonify({'error': 'Order not found'}), 404

    db.order_items.delete_many({'order_id': order_id})
    db.orders.delete_one({'id': order_id})
    return jsonify({'success': True, 'message': f'Order #{order_id} deleted.'})

# ==========================================
# PUBLIC ORDER TRACKING & CSV EXPORT ENDPOINTS
# ==========================================

@app.route('/api/orders/track/<int:order_id>', methods=['GET'])
def track_order_public(order_id):
    db = get_db()
    order = db.orders.find_one({'id': order_id})
    if not order:
        return jsonify({'error': f'Order #{order_id} not found.'}), 404

    items = list(db.order_items.find({'order_id': order_id}))
    if not items and isinstance(order.get('items'), list):
        items = order['items']
    item_list = []
    for item in items:
        item_list.append({
            'item_name': item['item_name'],
            'custom_options': item.get('custom_options') or '',
            'unit_price': item['unit_price'],
            'quantity': item['quantity']
        })

    status = order.get('status') or 'Pending'
    est_time = "10 - 15 mins"
    if status == 'Preparing':
        est_time = "5 - 10 mins"
    elif status == 'Ready':
        est_time = "Ready for pickup / Out for delivery"
    elif status == 'Completed':
        est_time = "Delivered / Picked up"
    elif status == 'Cancelled':
        est_time = "Order Cancelled"

    del_addr = order.get('delivery_address') or ''
    del_lat = order.get('delivery_lat')
    del_lng = order.get('delivery_lng')
    del_maps = order.get('delivery_maps_url') or ''
    del_notes = order.get('delivery_notes') or ''

    if not del_maps and del_lat and del_lng:
        del_maps = f"https://www.google.com/maps/dir/?api=1&origin=7.1420,125.6265&destination={del_lat},{del_lng}"
    elif not del_maps and del_addr:
        import urllib.parse
        del_maps = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(del_addr)}"

    result = {
        'id': order['id'],
        'customer_name': order['customer_name'],
        'fulfillment_mode': order['fulfillment_mode'],
        'contact_info': order.get('contact_info') or '',
        'subtotal': order['subtotal'],
        'tax': order['tax'],
        'total': order['total'],
        'status': status,
        'delivery_address': del_addr,
        'delivery_lat': del_lat,
        'delivery_lng': del_lng,
        'delivery_maps_url': del_maps,
        'delivery_notes': del_notes,
        'payment_method': order.get('payment_method') or 'Cash',
        'payment_status': order.get('payment_status') or 'Pending',
        'estimated_time': est_time,
        'created_at': order.get('created_at') or '',
        'items': item_list
    }
    return jsonify(result)

@app.route('/api/admin/export-orders', methods=['GET'])
@require_auth(roles=['admin', 'staff'])
def export_orders_csv():
    import csv
    import io
    from flask import Response

    db = get_db()
    orders = list(db.orders.find({}).sort('id', -1))

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        'Order ID', 'Customer Name', 'Fulfillment Mode', 'Contact Info',
        'Subtotal (PHP)', 'Tax (PHP)', 'Total (PHP)', 'Order Status',
        'Payment Method', 'Payment Reference', 'Payment Status', 'Created At'
    ])

    for o in orders:
        writer.writerow([
            o['id'],
            o['customer_name'],
            o['fulfillment_mode'],
            o.get('contact_info') or '',
            f"{float(o.get('subtotal') or 0.0):.2f}",
            f"{float(o.get('tax') or 0.0):.2f}",
            f"{float(o.get('total') or 0.0):.2f}",
            o.get('status') or 'Pending',
            o.get('payment_method') or 'Cash',
            o.get('payment_reference') or '',
            o.get('payment_status') or 'Pending',
            o.get('created_at') or ''
        ])

    csv_data = '\ufeff' + output.getvalue()
    return Response(
        csv_data.encode('utf-8-sig'),
        mimetype='text/csv; charset=utf-8',
        headers={'Content-Disposition': 'attachment; filename=jules_cafe_orders_export.csv'}
    )

@app.route('/api/admin/analytics', methods=['GET'])
@require_auth(roles=['admin', 'staff'])
def get_admin_analytics():
    db = get_db()
    orders = list(db.orders.find({}).sort('created_at', 1))
    all_order_items = list(db.order_items.find({}))
    all_menu_items = list(db.menu_items.find({}))

    def match_category(item_name_str: str) -> str:
        iname = (item_name_str or '').lower()
        for mi in all_menu_items:
            mname = (mi.get('name') or '').lower()
            if mname and (iname == mname or mname in iname):
                return mi.get('category') or 'espresso'
        return 'espresso'

    order_items = []
    for oi in all_order_items:
        oi_copy = dict(oi)
        oi_copy['category'] = match_category(oi.get('item_name', ''))
        order_items.append(oi_copy)

    from collections import defaultdict
    import datetime

    # 1. Past 7 days sales
    today = datetime.date.today()
    past_7_days = [today - datetime.timedelta(days=i) for i in range(6, -1, -1)]
    sales_by_day = {d.strftime('%Y-%m-%d'): {'date': d.strftime('%b %d'), 'revenue': 0.0, 'count': 0} for d in past_7_days}

    total_revenue = 0.0
    completed_orders = 0
    gcash_count = 0
    cash_count = 0
    hourly_counts = defaultdict(int)

    for o in orders:
        total = float(o['total'] or 0.0)
        status = (o['status'] or 'Pending').lower()
        method = (o['payment_method'] or 'Cash').lower()

        if 'gcash' in method:
            gcash_count += 1
        else:
            cash_count += 1

        if status != 'cancelled':
            total_revenue += total
            completed_orders += 1

            # Parse date
            raw_date = o['created_at'] or ''
            date_str = raw_date.split('T')[0] if 'T' in raw_date else raw_date.split(' ')[0]
            if date_str in sales_by_day:
                sales_by_day[date_str]['revenue'] += total
                sales_by_day[date_str]['count'] += 1

            # Parse hour
            try:
                time_str = raw_date.split('T')[1] if 'T' in raw_date else (raw_date.split(' ')[1] if ' ' in raw_date else '')
                if time_str:
                    hr = int(time_str.split(':')[0])
                    hourly_counts[hr] += 1
            except Exception:
                pass

    # 2. Category sales breakdown
    cat_sales = defaultdict(lambda: {'total_qty': 0, 'revenue': 0.0})
    for item in order_items:
        cat = item['category'] or 'espresso'
        qty = item['quantity'] or 1
        price = float(item['unit_price'] or 0.0) * qty
        cat_sales[cat]['total_qty'] += qty
        cat_sales[cat]['revenue'] += price

    cat_list = [
        {'category': 'espresso', 'label': 'Espresso-Based', 'qty': cat_sales['espresso']['total_qty'], 'revenue': round(cat_sales['espresso']['revenue'], 2)},
        {'category': 'milk', 'label': 'Milk-Based', 'qty': cat_sales['milk']['total_qty'], 'revenue': round(cat_sales['milk']['revenue'], 2)},
        {'category': 'frappe', 'label': 'Frappe', 'qty': cat_sales['frappe']['total_qty'], 'revenue': round(cat_sales['frappe']['revenue'], 2)},
        {'category': 'quickbites', 'label': 'Quick Bites', 'qty': cat_sales['quickbites']['total_qty'], 'revenue': round(cat_sales['quickbites']['revenue'], 2)}
    ]

    daily_chart_data = list(sales_by_day.values())

    return jsonify({
        'totalRevenue': round(total_revenue, 2),
        'completedOrders': completed_orders,
        'dailySales': daily_chart_data,
        'categoryBreakdown': cat_list,
        'paymentRatio': {
            'gcash': gcash_count,
            'cash': cash_count
        },
        'peakHours': dict(sorted(hourly_counts.items()))
    })

@app.route('/api/specials', methods=['GET'])
def get_daily_specials():
    return jsonify({
        'coffeeOfTheDay': {
            'id': 'esp-10',
            'name': 'Spanish Latte (Iced)',
            'tagline': '🔥 Daily Barista Special • 15% OFF!',
            'originalPrice': 155.0,
            'specialPrice': 130.0,
            'badge': '15% OFF TODAY',
            'promoCode': 'DAILY15',
            'desc': 'Rich double espresso with silky sweetened condensed milk and fresh Davao farm milk over ice.',
            'category': 'espresso'
        },
        'bundles': [
            {
                'id': 'bundle-1',
                'name': '🌅 Morning Energy Pair',
                'itemsStr': 'Iced Americano + Warm Ham & Cheese Sandwich',
                'originalPrice': 240.0,
                'bundlePrice': 195.0,
                'savings': 'Save ₱45',
                'badge': 'BEST VALUE'
            },
            {
                'id': 'bundle-2',
                'name': '🍫 Sweet Merienda Delight',
                'itemsStr': 'Nutella Cheesecake Frappe + Creamy Carbonara',
                'originalPrice': 310.0,
                'bundlePrice': 260.0,
                'savings': 'Save ₱50',
                'badge': 'POPULAR'
            }
        ]
    })

# ==========================================
# CUSTOMER REVIEWS ENDPOINTS
# ==========================================

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    db = get_db()
    reviews = list(db.reviews.find({'is_approved': 1}).sort('id', -1).limit(20))

    rev_list = []
    for r in reviews:
        rev_list.append({
            'id': r['id'],
            'customer_name': r['customer_name'],
            'rating': r['rating'],
            'comment': r['comment'],
            'favorite_item': r.get('favorite_item') or 'Coffee',
            'created_at': r.get('created_at') or ''
        })
    return jsonify(rev_list)

@app.route('/api/reviews', methods=['POST'])
def submit_review():
    data = request.get_json() or {}
    customer_name = data.get('customer_name', '').strip() or 'Coffee Lover'
    rating = int(data.get('rating', 5))
    comment = data.get('comment', '').strip()
    favorite_item = data.get('favorite_item', '').strip() or 'Spanish Latte'

    if not comment:
        return jsonify({'error': 'Review comment cannot be empty.'}), 400

    rating = max(1, min(5, rating))

    db = get_db()
    review_id = get_next_sequence('reviews')
    db.reviews.insert_one({
        'id': review_id,
        'customer_name': customer_name,
        'rating': rating,
        'comment': comment,
        'favorite_item': favorite_item,
        'is_approved': 1,
        'created_at': now_str()
    })

    return jsonify({'success': True, 'id': review_id, 'message': 'Thank you for your feedback! Review published.'}), 201



# ==========================================
# USER ACCOUNTS CRUD ENDPOINTS (ADMIN ONLY)
# ==========================================

@app.route('/api/users', methods=['GET'])
@require_auth(roles=['admin'])
def get_users():
    db = get_db()
    users = list(db.users.find({}).sort('id', 1))

    user_list = []
    for u in users:
        user_list.append({
            'id': u['id'],
            'username': u['username'],
            'full_name': u['full_name'],
            'role': u['role'],
            'email': u.get('email') or '',
            'phone': u.get('phone') or '',
            'delivery_address': u.get('delivery_address') or '',
            'created_at': u.get('created_at') or ''
        })
    return jsonify(user_list)

@app.route('/api/users', methods=['POST'])
@require_auth(roles=['admin'])
def create_user():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    full_name = data.get('full_name', '').strip()
    role = data.get('role', 'employee').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    delivery_address = data.get('delivery_address', '').strip()

    if not username or not password or not full_name:
        return jsonify({'error': 'Username, password, and full name are required'}), 400

    if role not in ['admin', 'staff', 'employee', 'customer']:
        return jsonify({'error': 'Role must be admin, staff, employee, or customer'}), 400

    db = get_db()
    existing = db.users.find_one({'username': username})
    if existing:
        return jsonify({'error': f'Username "{username}" is already taken.'}), 400

    pw_hash = generate_password_hash(password)
    user_id = get_next_sequence('users')
    db.users.insert_one({
        'id': user_id,
        'username': username,
        'password_hash': pw_hash,
        'full_name': full_name,
        'role': role,
        'email': email,
        'phone': phone,
        'delivery_address': delivery_address,
        'created_at': now_str()
    })

    return jsonify({
        'success': True,
        'user': {'id': user_id, 'username': username, 'full_name': full_name, 'role': role, 'email': email, 'phone': phone, 'delivery_address': delivery_address},
        'message': f'User "{username}" created successfully as {role.upper()}.'
    }), 201

@app.route('/api/users/<int:user_id>', methods=['PUT'])
@require_auth(roles=['admin'])
def update_user(user_id):
    data = request.get_json() or {}
    full_name = data.get('full_name', '').strip()
    role = data.get('role', '').strip()
    password = data.get('password', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    delivery_address = data.get('delivery_address', '').strip()

    db = get_db()
    existing = db.users.find_one({'id': user_id})
    if not existing:
        return jsonify({'error': 'User not found'}), 404

    if role and role not in ['admin', 'staff', 'employee', 'customer']:
        return jsonify({'error': 'Role must be admin, staff, employee, or customer'}), 400

    new_full_name = full_name if full_name else existing['full_name']
    new_role = role if role else existing['role']
    new_email = email if email is not None else (existing.get('email') or '')
    new_phone = phone if phone is not None else (existing.get('phone') or '')
    new_addr = delivery_address if delivery_address is not None else (existing.get('delivery_address') or '')

    update_fields = {
        'full_name': new_full_name,
        'role': new_role,
        'email': new_email,
        'phone': new_phone,
        'delivery_address': new_addr
    }
    if password:
        update_fields['password_hash'] = generate_password_hash(password)

    db.users.update_one({'id': user_id}, {'$set': update_fields})

    return jsonify({'success': True, 'message': f'User ID #{user_id} updated successfully.'})

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@require_auth(roles=['admin'])
def delete_user(user_id):
    db = get_db()
    existing = db.users.find_one({'id': user_id})
    if not existing:
        return jsonify({'error': 'User not found'}), 404

    # Prevent deleting the current user or last admin
    current = get_current_user()
    if current and current['id'] == user_id:
        return jsonify({'error': 'You cannot delete your own active admin account.'}), 400

    admin_count = db.users.count_documents({'role': 'admin'})
    if existing['role'] == 'admin' and admin_count <= 1:
        return jsonify({'error': 'Cannot delete the last remaining Admin account.'}), 400

    db.users.delete_one({'id': user_id})
    db.user_sessions.delete_many({'user_id': user_id})

    return jsonify({'success': True, 'message': f'User "{existing["username"]}" deleted.'})

# ==========================================
# ANALYTICS ENDPOINT
# ==========================================

@app.route('/api/analytics', methods=['GET'])
@require_auth(roles=['admin', 'staff'])
def get_analytics():
    db = get_db()
    all_orders = list(db.orders.find({}))
    all_order_items = list(db.order_items.find({}))
    all_menu = list(db.menu_items.find({}))

    non_cancelled_orders = [o for o in all_orders if (o.get('status') or 'Pending') != 'Cancelled']
    non_cancelled_ids = {o['id'] for o in non_cancelled_orders}

    total_sales = sum(float(o.get('total') or 0.0) for o in non_cancelled_orders)
    total_orders = len(all_orders)
    pending_orders = sum(1 for o in all_orders if (o.get('status') or 'Pending') in ('Pending', 'Preparing'))
    completed_orders = sum(1 for o in all_orders if (o.get('status') or 'Pending') in ('Completed', 'Ready'))
    cancelled_orders = sum(1 for o in all_orders if (o.get('status') or 'Pending') == 'Cancelled')
    menu_count = len(all_menu)
    staff_count = db.users.count_documents({})

    avg_order_value = (total_sales / total_orders) if total_orders > 0 else 0.0

    # Top selling items
    item_stats = {}
    for oi in all_order_items:
        if oi.get('order_id') in non_cancelled_ids:
            iname = oi.get('item_name') or 'Unknown Item'
            qty = int(oi.get('quantity') or 0)
            rev = float(oi.get('unit_price') or 0.0) * qty
            if iname not in item_stats:
                item_stats[iname] = {'name': iname, 'qty': 0, 'revenue': 0.0}
            item_stats[iname]['qty'] += qty
            item_stats[iname]['revenue'] += rev

    top_selling = sorted(item_stats.values(), key=lambda x: x['qty'], reverse=True)[:5]

    # Fulfillment breakdown
    pickup_count = sum(1 for o in all_orders if o.get('fulfillment_mode') == 'pickup')
    delivery_count = sum(1 for o in all_orders if o.get('fulfillment_mode') == 'delivery')

    # Category popularity distribution
    menu_cat_by_name = {m['name']: m.get('category', 'espresso') for m in all_menu}
    category_sales = {'espresso': 0, 'milk': 0, 'frappe': 0, 'quickbites': 0}
    total_cat_items = 0
    for oi in all_order_items:
        if oi.get('order_id') in non_cancelled_ids:
            cat_key = menu_cat_by_name.get(oi.get('item_name'), 'espresso')
            if cat_key not in category_sales:
                cat_key = 'espresso'
            qty = int(oi.get('quantity') or 0)
            category_sales[cat_key] += qty
            total_cat_items += qty

    category_percentages = {}
    for cat_k, qty_val in category_sales.items():
        category_percentages[cat_k] = round((qty_val / total_cat_items) * 100) if total_cat_items > 0 else (45 if cat_k == 'espresso' else (25 if cat_k == 'milk' else (18 if cat_k == 'frappe' else 12)))

    return jsonify({
        'totalSales': total_sales,
        'totalOrders': total_orders,
        'pendingOrders': pending_orders,
        'completedOrders': completed_orders,
        'cancelledOrders': cancelled_orders,
        'avgOrderValue': avg_order_value,
        'menuCount': menu_count,
        'staffCount': staff_count,
        'topSelling': top_selling,
        'fulfillment': {
            'pickup': pickup_count,
            'delivery': delivery_count
        },
        'categoryPopularity': category_percentages
    })

# ==========================================
# RECOMMENDATIONS (EXISTING)
# ==========================================

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    data = request.get_json() or {}
    cart = data.get('cart', [])

    db = get_db()
    all_menu = list(db.menu_items.find({}))
    menu_by_id = {item['id']: item for item in all_menu}
    menu_by_name = {item['name'].lower(): item for item in all_menu}

    cart_item_ids = set()
    cart_categories = set()
    for ci in cart:
        item_id = ci.get('id', '')
        cart_item_ids.add(item_id)
        if item_id in menu_by_id:
            cart_categories.add(menu_by_id[item_id]['category'])

    co_occurrences = {}
    if cart_item_ids:
        all_ois = list(db.order_items.find({}))
        by_order = {}
        for oi in all_ois:
            by_order.setdefault(oi.get('order_id'), []).append(oi.get('item_name', ''))
        freq = {}
        for _, names in by_order.items():
            if len(names) > 1:
                for n1 in names:
                    for n2 in names:
                        if n1 != n2:
                            freq[n2] = freq.get(n2, 0) + 1
        for item_name, count_val in sorted(freq.items(), key=lambda x: x[1], reverse=True):
            name_lower = item_name.lower()
            if name_lower in menu_by_name:
                item_obj = menu_by_name[name_lower]
                if item_obj['id'] not in cart_item_ids:
                    co_occurrences[item_obj['id']] = count_val

    recommendations = []
    seen_ids = set()

    # 1. Database Co-occurrence match
    if co_occurrences:
        best_id = max(co_occurrences, key=co_occurrences.get)
        item = menu_by_id[best_id]
        seen_ids.add(item['id'])
        recommendations.append({
            'id': item['id'],
            'name': item['name'],
            'category': item['category'],
            'basePrice': item['base_price'],
            'reason': "🔥 Frequently bought together with items in your cart!",
            'badge': "Database Recommendation"
        })

    # 2. Category Synergy Rules
    if 'espresso' in cart_categories and 'quickbites' not in cart_categories:
        if 'bites-1' not in cart_item_ids and 'bites-1' not in seen_ids and 'bites-1' in menu_by_id:
            item = menu_by_id['bites-1']
            seen_ids.add(item['id'])
            recommendations.append({
                'id': item['id'],
                'name': item['name'],
                'category': item['category'],
                'basePrice': item['base_price'],
                'reason': item['pairing_recommendation'] or "Pairs perfectly with your coffee order!",
                'badge': "Barista Pairing"
            })
    elif 'quickbites' in cart_categories and 'espresso' not in cart_categories:
        if 'esp-10' not in cart_item_ids and 'esp-10' not in seen_ids and 'esp-10' in menu_by_id:
            item = menu_by_id['esp-10']
            seen_ids.add(item['id'])
            recommendations.append({
                'id': item['id'],
                'name': item['name'],
                'category': item['category'],
                'basePrice': item['base_price'],
                'reason': "Enjoy your food with our signature Spanish Latte!",
                'badge': "Coffee Match"
            })

    # 3. Fallback House Favorite
    if not recommendations:
        item = menu_by_id.get('esp-10') or (all_menu[0] if all_menu else None)
        if item:
            recommendations.append({
                'id': item['id'],
                'name': item['name'],
                'category': item['category'],
                'basePrice': item['base_price'],
                'reason': item['pairing_recommendation'] or "Our #1 top seller!",
                'badge': "House Favorite"
            })

    return jsonify(recommendations)

def normalize_recipe(recipe):
    base_raw = str(recipe.get('base', '')).lower()
    if 'decaf' in base_raw:
        recipe['base'] = 'Decaf Shot'
    elif 'double' in base_raw or 'triple' in base_raw or 'dark' in base_raw:
        recipe['base'] = 'Double Espresso'
    else:
        recipe['base'] = 'Single Espresso'

    temp_raw = str(recipe.get('temp', '')).lower()
    if 'blend' in temp_raw or 'frap' in temp_raw or 'smoothie' in temp_raw:
        recipe['temp'] = 'Blended Frappe'
    elif 'ice' in temp_raw or 'cold' in temp_raw or 'chilled' in temp_raw:
        recipe['temp'] = 'Over Ice'
    else:
        recipe['temp'] = 'Hot Steamed'

    size_raw = str(recipe.get('size', '')).lower()
    if '16' in size_raw or 'large' in size_raw:
        recipe['size'] = '16oz Large'
    elif '8' in size_raw or 'small' in size_raw or 'regular' in size_raw:
        recipe['size'] = '8oz Regular'
    else:
        recipe['size'] = '12oz Medium'

    milk_raw = str(recipe.get('milk', '')).lower()
    if 'oat' in milk_raw:
        recipe['milk'] = 'Oat Milk'
    elif 'almond' in milk_raw:
        recipe['milk'] = 'Almond Milk'
    elif 'black' in milk_raw or 'no milk' in milk_raw or 'none' in milk_raw:
        recipe['milk'] = 'Black / No Milk'
    else:
        recipe['milk'] = 'Whole Milk'

    syrup_raw = str(recipe.get('syrup', '')).lower()
    if 'biscoff' in syrup_raw or 'cookie butter' in syrup_raw:
        recipe['syrup'] = 'Lotus Biscoff Syrup'
    elif 'caramel' in syrup_raw:
        recipe['syrup'] = 'Caramel Syrup'
    elif 'hazelnut' in syrup_raw or 'nut' in syrup_raw:
        recipe['syrup'] = 'Hazelnut Syrup'
    elif 'vanilla' in syrup_raw:
        recipe['syrup'] = 'Vanilla Syrup'
    elif 'mocha' in syrup_raw or 'choco' in syrup_raw or 'dark' in syrup_raw:
        recipe['syrup'] = 'Dark Mocha Sauce'
    else:
        recipe['syrup'] = 'No Syrup'

    top_raw = str(recipe.get('topping', '')).lower()
    if 'cheese' in top_raw or 'foam' in top_raw or 'salted' in top_raw:
        recipe['topping'] = 'Salted Cream Cheese Foam'
    elif 'crumb' in top_raw or 'cookie' in top_raw or 'oreo' in top_raw:
        recipe['topping'] = 'Cookie Crumbs'
    elif 'milo' in top_raw or 'powder' in top_raw or 'cocoa' in top_raw:
        recipe['topping'] = 'Milo Powder Crown'
    elif 'whip' in top_raw or 'cream' in top_raw:
        recipe['topping'] = 'Whipped Cream'
    else:
        recipe['topping'] = 'No Topping'

    recipe['extraShot'] = bool(recipe.get('extraShot', False))
    recipe['success'] = True
    return recipe

# ==========================================
# AI BARISTA COFFEE SUGGESTION ENDPOINT
# ==========================================

@app.route('/api/ai-coffee-suggest', methods=['POST'])
def ai_coffee_suggest():
    import random
    data = request.get_json() or {}
    prompt = data.get('prompt', '').strip()
    mood = data.get('mood', '').strip()

    gemini_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('AI_API_KEY')
    openai_key = os.environ.get('OPENAI_API_KEY')

    # 1. Real Google Gemini API Integration
    if gemini_key and (prompt or mood):
        for model_name in ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-pro-latest']:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={gemini_key}"
                prompt_instruction = f"""
You are the AI Barista Architect for Jules Cafe, a specialty cafe in Davao City, Philippines.
Customer request: "{prompt}" (Mood/Vibe: "{mood}").
Design an artisanal signature custom coffee from our available options:

- base: must be EXACTLY one of ["Single Espresso", "Double Espresso", "Decaf Shot"]
- temp: must be EXACTLY one of ["Hot Steamed", "Over Ice", "Blended Frappe"]
- size: must be EXACTLY one of ["8oz Regular", "12oz Medium", "16oz Large"]
- milk: must be EXACTLY one of ["Whole Milk", "Oat Milk", "Almond Milk", "Black / No Milk"]
- syrup: must be EXACTLY one of ["No Syrup", "Vanilla Syrup", "Caramel Syrup", "Hazelnut Syrup", "Lotus Biscoff Syrup", "Dark Mocha Sauce"]
- topping: must be EXACTLY one of ["No Topping", "Whipped Cream", "Salted Cream Cheese Foam", "Cookie Crumbs", "Milo Powder Crown"]
- extraShot: boolean (true or false)

Return ONLY valid JSON matching this schema:
{{
  "name": "Creative Drink Name with Emoji",
  "reason": "1-2 sentence appetizing barista rationale explaining how this recipe matches their mood.",
  "base": "Single Espresso | Double Espresso | Decaf Shot",
  "temp": "Hot Steamed | Over Ice | Blended Frappe",
  "size": "8oz Regular | 12oz Medium | 16oz Large",
  "milk": "Whole Milk | Oat Milk | Almond Milk | Black / No Milk",
  "syrup": "No Syrup | Vanilla Syrup | Caramel Syrup | Hazelnut Syrup | Lotus Biscoff Syrup | Dark Mocha Sauce",
  "topping": "No Topping | Whipped Cream | Salted Cream Cheese Foam | Cookie Crumbs | Milo Powder Crown",
  "extraShot": false
}}
"""
                payload = json.dumps({
                    "contents": [{"parts": [{"text": prompt_instruction}]}],
                    "generationConfig": {"response_mime_type": "application/json", "temperature": 0.7}
                }).encode('utf-8')
                
                req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(req, timeout=10) as resp:
                    resp_data = json.loads(resp.read().decode('utf-8'))
                    text_content = resp_data['candidates'][0]['content']['parts'][0]['text']
                    recipe = json.loads(text_content)
                    recipe = normalize_recipe(recipe)
                    recipe['ai_powered_by'] = 'Google Gemini AI'
                    return jsonify(recipe)
            except Exception as e:
                print(f"[AI Barista] Gemini API notice ({model_name}): {e}. Trying next model.")

    # 2. Real OpenAI API Integration
    if openai_key and (prompt or mood):
        try:
            url = "https://api.openai.com/v1/chat/completions"
            sys_msg = "You are the AI Barista Coffee Architect for Jules Cafe. Return only JSON with name, reason, base (Single Espresso, Double Espresso, Decaf Shot), temp (Hot Steamed, Over Ice, Blended Frappe), size (8oz Regular, 12oz Medium, 16oz Large), milk (Whole Milk, Oat Milk, Almond Milk, Black / No Milk), syrup (No Syrup, Vanilla Syrup, Caramel Syrup, Hazelnut Syrup, Lotus Biscoff Syrup, Dark Mocha Sauce), topping (No Topping, Whipped Cream, Salted Cream Cheese Foam, Cookie Crumbs, Milo Powder Crown), extraShot (bool)."
            payload = json.dumps({
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": sys_msg},
                    {"role": "user", "content": f"Customer craving: {prompt} (Mood: {mood})"}
                ],
                "response_format": {"type": "json_object"}
            }).encode('utf-8')
            req = urllib.request.Request(url, data=payload, headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {openai_key}'
            })
            with urllib.request.urlopen(req, timeout=8) as resp:
                resp_data = json.loads(resp.read().decode('utf-8'))
                recipe = json.loads(resp_data['choices'][0]['message']['content'])
                recipe['success'] = True
                recipe['ai_powered_by'] = 'OpenAI GPT'
                return jsonify(recipe)
        except Exception as e:
            print(f"[AI Barista] OpenAI API notice: {e}. Using smart rule-based generator.")

    # 3. Built-In Smart Fallback Engine (No Cold Brew Base)
    prompt_lower = prompt.lower()
    mood_lower = mood.lower()
    combined_text = f"{prompt_lower} {mood_lower}".strip()

    if any(w in combined_text for w in ['study', 'energy', 'focus', 'night', 'tired', 'exam', 'boost', 'work']):
        return jsonify({
            'success': True,
            'name': '⚡ Midnight Study Grind',
            'reason': 'AI Barista Pick: Double Espresso + Extra Shot boost with Oat Milk and Biscoff Cookie butter for high stamina without a sugar crash.',
            'base': 'Double Espresso',
            'temp': 'Over Ice',
            'size': '16oz Large',
            'milk': 'Oat Milk',
            'syrup': 'Lotus Biscoff Syrup',
            'topping': 'Cookie Crumbs',
            'extraShot': True,
            'ai_powered_by': 'Jules AI Engine'
        })
    elif any(w in combined_text for w in ['sweet', 'creamy', 'dessert', 'treat', 'caramel', 'chocolate', 'cheesecake']):
        return jsonify({
            'success': True,
            'name': '🍦 Caramel Cloud Supreme',
            'reason': 'AI Barista Pick: Velvety blended frappe with buttery caramel syrup, whole milk, and topped with salted cream cheese foam.',
            'base': 'Double Espresso',
            'temp': 'Blended Frappe',
            'size': '12oz Medium',
            'milk': 'Whole Milk',
            'syrup': 'Caramel Syrup',
            'topping': 'Salted Cream Cheese Foam',
            'extraShot': False,
            'ai_powered_by': 'Jules AI Engine'
        })
    elif any(w in combined_text for w in ['davao', 'hot', 'afternoon', 'chill', 'refresh', 'summer', 'ice']):
        return jsonify({
            'success': True,
            'name': '🌴 Davao Sunburst Iced Latte',
            'reason': 'AI Barista Pick: Double espresso over ice with nutty almond milk, vanilla syrup, and Milo crown.',
            'base': 'Double Espresso',
            'temp': 'Over Ice',
            'size': '16oz Large',
            'milk': 'Almond Milk',
            'syrup': 'Vanilla Syrup',
            'topping': 'Milo Powder Crown',
            'extraShot': False,
            'ai_powered_by': 'Jules AI Engine'
        })
    elif any(w in combined_text for w in ['strong', 'bold', 'intense', 'dark', 'punch', 'black']):
        return jsonify({
            'success': True,
            'name': '🔥 Dark Velvet Blackout',
            'reason': 'AI Barista Pick: Pure coffee intensity — hot double espresso, dark mocha cocoa, and an extra shot boost with zero milk.',
            'base': 'Double Espresso',
            'temp': 'Hot Steamed',
            'size': '12oz Medium',
            'milk': 'Black / No Milk',
            'syrup': 'Dark Mocha Sauce',
            'topping': 'No Topping',
            'extraShot': True,
            'ai_powered_by': 'Jules AI Engine'
        })
    elif any(w in combined_text for w in ['decaf', 'relax', 'evening', 'gentle', 'light', 'nut', 'hazelnut']):
        return jsonify({
            'success': True,
            'name': '🌿 Sunset Hazelnut Silk',
            'reason': 'AI Barista Pick: Smooth decaf espresso with warm hazelnut syrup, steamed oat milk, and fluffy whipped cream.',
            'base': 'Decaf Shot',
            'temp': 'Hot Steamed',
            'size': '12oz Medium',
            'milk': 'Oat Milk',
            'syrup': 'Hazelnut Syrup',
            'topping': 'Whipped Cream',
            'extraShot': False,
            'ai_powered_by': 'Jules AI Engine'
        })
    else:
        presets = [
            {
                'name': '✨ Barista\'s Secret Velvet',
                'reason': 'AI Barista Pick: Double espresso layered with oat milk, caramel syrup, and salted cream cheese foam.',
                'base': 'Double Espresso',
                'temp': 'Over Ice',
                'size': '16oz Large',
                'milk': 'Oat Milk',
                'syrup': 'Caramel Syrup',
                'topping': 'Salted Cream Cheese Foam',
                'extraShot': False
            },
            {
                'name': '🍫 Dark Mocha Cookie Crunch',
                'reason': 'AI Barista Pick: Rich double shot espresso blended with dark mocha, whole milk, and topped with cookie crumbles.',
                'base': 'Double Espresso',
                'temp': 'Blended Frappe',
                'size': '12oz Medium',
                'milk': 'Whole Milk',
                'syrup': 'Dark Mocha Sauce',
                'topping': 'Cookie Crumbs',
                'extraShot': True
            },
            {
                'name': '☕ Golden Vanilla Oat Latte',
                'reason': 'AI Barista Pick: Smooth hot double espresso infused with aromatic vanilla syrup and steamed oat milk.',
                'base': 'Double Espresso',
                'temp': 'Hot Steamed',
                'size': '12oz Medium',
                'milk': 'Oat Milk',
                'syrup': 'Vanilla Syrup',
                'topping': 'No Topping',
                'extraShot': False
            }
        ]
        pick = random.choice(presets)
        if prompt:
            pick['name'] = f"🤖 {prompt.title()} Craft"
            pick['reason'] = f"AI Custom Craft for '{prompt}': Crafted with optimal espresso ratio & complementary syrups."
        pick['success'] = True
        pick['ai_powered_by'] = 'Jules AI Engine'
        return jsonify(pick)
# ==========================================
# LIVE BARISTA & KITCHEN SUPPORT CHAT ENDPOINTS
# ==========================================

@app.route('/api/chat/send', methods=['POST'])
def send_chat_message():
    data = request.get_json() or {}
    session_id = data.get('session_id', '').strip() or f"chat-{uuid.uuid4().hex[:8]}"
    customer_name = data.get('customer_name', '').strip() or 'Guest'
    sender = data.get('sender', 'customer').strip()
    message = data.get('message', '').strip()

    if not message:
        return jsonify({'error': 'Message text cannot be empty'}), 400

    curr_user = get_current_user()
    if curr_user and sender == 'customer':
        customer_name = curr_user['full_name']

    db = get_db()

    # If sender is staff, preserve original customer_name for this session
    if sender == 'staff':
        existing_cust = db.chat_messages.find_one(
            {
                'session_id': session_id,
                'sender': 'customer',
                'customer_name': {'$ne': 'Staff Barista'}
            },
            sort=[('id', 1)]
        )
        if existing_cust and existing_cust.get('customer_name'):
            customer_name = existing_cust['customer_name']

    msg_id = get_next_sequence('chat_messages')
    ts_now = now_str()
    db.chat_sessions.replace_one(
        {'session_id': session_id},
        {
            'session_id': session_id,
            'customer_name': customer_name,
            'user_id': curr_user['id'] if curr_user else None,
            'created_at': ts_now,
            'updated_at': ts_now
        },
        upsert=True
    )
    db.chat_messages.insert_one({
        'id': msg_id,
        'session_id': session_id,
        'customer_name': customer_name,
        'sender': sender,
        'message': message,
        'is_read': 0,
        'created_at': ts_now
    })

    return jsonify({
        'success': True,
        'id': msg_id,
        'session_id': session_id,
        'customer_name': customer_name,
        'message': 'Message sent successfully.'
    }), 201

@app.route('/api/chat/messages/<session_id>', methods=['GET'])
def get_chat_messages(session_id):
    db = get_db()
    messages = list(db.chat_messages.find({'session_id': session_id}).sort('id', 1))

    msg_list = []
    for m in messages:
        msg_list.append({
            'id': m['id'],
            'session_id': m['session_id'],
            'customer_name': m['customer_name'],
            'sender': m['sender'],
            'message': m['message'],
            'is_read': bool(m.get('is_read')),
            'created_at': m.get('created_at') or ''
        })
    return jsonify(msg_list)

@app.route('/api/chat/unread-count/<session_id>', methods=['GET'])
def get_customer_unread_count(session_id):
    db = get_db()
    unread_count = db.chat_messages.count_documents({
        'session_id': session_id,
        'sender': 'staff',
        'is_read': 0
    })

    last_msg = db.chat_messages.find_one(
        {'session_id': session_id, 'sender': 'staff'},
        sort=[('id', -1)]
    )

    return jsonify({
        'unread_count': unread_count,
        'last_id': last_msg['id'] if last_msg else None,
        'last_message': last_msg['message'] if last_msg else '',
        'last_sender': last_msg['sender'] if last_msg else '',
        'last_time': last_msg.get('created_at') if last_msg else None
    })

@app.route('/api/chat/customer-read/<session_id>', methods=['PUT'])
def mark_customer_chat_read(session_id):
    db = get_db()
    db.chat_messages.update_many(
        {'session_id': session_id, 'sender': 'staff'},
        {'$set': {'is_read': 1}}
    )
    return jsonify({'success': True, 'message': 'Messages marked as read by customer.'})

@app.route('/api/chat/clear/<session_id>', methods=['POST'])
def clear_chat_session(session_id):
    db = get_db()
    db.chat_messages.delete_many({'session_id': session_id})
    return jsonify({'success': True, 'message': 'Conversation cleared successfully.'})

@app.route('/api/admin/chat/conversations', methods=['GET'])
@require_auth(roles=['admin', 'staff', 'employee'])
def get_chat_conversations():
    db = get_db()
    all_msgs = list(db.chat_messages.find({}).sort('id', 1))

    sessions_map = {}
    for m in all_msgs:
        sid = m['session_id']
        if sid not in sessions_map:
            sessions_map[sid] = {
                'session_id': sid,
                'customer_name': None,
                'fallback_name': m.get('customer_name'),
                'last_time': m.get('created_at') or '',
                'unread_count': 0,
                'last_message': m.get('message') or '',
                'last_sender': m.get('sender') or 'customer'
            }
        entry = sessions_map[sid]
        if m.get('sender') == 'customer' and m.get('customer_name'):
            entry['customer_name'] = m['customer_name']
        if (m.get('created_at') or '') >= entry['last_time']:
            entry['last_time'] = m.get('created_at') or ''
        if m.get('sender') == 'customer' and not m.get('is_read'):
            entry['unread_count'] += 1
        entry['last_message'] = m.get('message') or ''
        entry['last_sender'] = m.get('sender') or 'customer'

    conv_list = []
    for s in sorted(sessions_map.values(), key=lambda x: x['last_time'], reverse=True):
        is_guest = s['session_id'].startswith('chat-guest-')
        c_name = s['customer_name'] or s['fallback_name'] or ('Guest Customer' if is_guest else 'Coffee Lover')
        conv_list.append({
            'session_id': s['session_id'],
            'customer_name': c_name,
            'is_guest': is_guest,
            'last_time': s['last_time'],
            'unread_count': s['unread_count'],
            'last_message': s['last_message'],
            'last_sender': s['last_sender']
        })
    return jsonify(conv_list)

@app.route('/api/admin/chat/conversations/<session_id>', methods=['DELETE'])
@require_auth(roles=['admin', 'staff', 'employee'])
def delete_chat_conversation(session_id):
    db = get_db()
    db.chat_messages.delete_many({'session_id': session_id})
    return jsonify({'success': True, 'message': 'Conversation deleted.'})

@app.route('/api/admin/chat/read/<session_id>', methods=['PUT'])
@require_auth(roles=['admin', 'staff', 'employee'])
def mark_chat_read(session_id):
    db = get_db()
    db.chat_messages.update_many(
        {'session_id': session_id, 'sender': 'customer'},
        {'$set': {'is_read': 1}}
    )
    return jsonify({'success': True, 'message': 'Chat marked as read.'})

if __name__ == '__main__':
    import socket
    init_db()
    
    local_ip = "127.0.0.1"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        local_ip = "127.0.0.1"

    print("=" * 60)
    print("  Jules Cafe Flask Backend Server Running")
    print(f"  - Desktop / Localhost:  http://127.0.0.1:5000")
    print(f"  - Mobile Phone (Wi-Fi): http://{local_ip}:5000")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
