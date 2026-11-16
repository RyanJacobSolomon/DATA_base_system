import sqlite3
import os
import hashlib
from mongo_db import get_db, get_next_sequence, sync_sequence, save_local_store, now_str

DB_PATH = os.path.join(os.path.dirname(__file__), 'cafe.db')

def hash_password(password: str) -> str:
    salt = "jules_cafe_secret_salt_2026"
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()

DEFAULT_USERS = [
    {
        'username': 'admin',
        'password': 'admin123',
        'full_name': 'Admin Manager',
        'role': 'admin'
    },
    {
        'username': 'staff',
        'password': 'staff123',
        'full_name': 'Senior Barista Staff',
        'role': 'staff'
    },
    {
        'username': 'employee',
        'password': 'employee123',
        'full_name': 'Front Desk Employee',
        'role': 'employee'
    }
]


DEFAULT_MENU = [
    # --- ESPRESSO-BASED ---
    {
        'id': 'esp-1',
        'category': 'espresso',
        'name': 'Americano',
        'desc': 'Rich espresso diluted with hot water or chilled over ice.',
        'base_price': 95,
        'price_8oz': 95,
        'price_12oz': 115,
        'price_16oz': 135,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Pairs nicely with Special Cassava!'
    },
    {
        'id': 'esp-2',
        'category': 'espresso',
        'name': 'Biscoff Latte',
        'desc': 'Signature espresso blended with cookie butter syrup and textured milk.',
        'base_price': 145,
        'price_8oz': 145,
        'price_12oz': 165,
        'price_16oz': 185,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Pairs perfectly with Creamy Carbonara!'
    },
    {
        'id': 'esp-3',
        'category': 'espresso',
        'name': 'Cafe Latte',
        'desc': 'Classic smooth espresso topped with silky microfoam.',
        'base_price': 105,
        'price_8oz': 105,
        'price_12oz': 125,
        'price_16oz': 145,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Great accompaniment to Ham & Cheese toast.'
    },
    {
        'id': 'esp-4',
        'category': 'espresso',
        'name': 'Cafe Mocha',
        'desc': 'Rich dark chocolate cocoa combined with espresso and steamed milk.',
        'base_price': 115,
        'price_8oz': 115,
        'price_12oz': 135,
        'price_16oz': 155,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Try with Pinoy Spaghetti!'
    },
    {
        'id': 'esp-5',
        'category': 'espresso',
        'name': 'Cappuccino',
        'desc': 'Equal parts bold espresso, warm milk, and deep velvet foam layer.',
        'base_price': 105,
        'price_8oz': 105,
        'price_12oz': 125,
        'price_16oz': 145,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Complements our Special Cassava cake.'
    },
    {
        'id': 'esp-6',
        'category': 'espresso',
        'name': 'Caramel Macchiato',
        'desc': 'Vanilla-infused milk marked with espresso and buttery caramel drizzle.',
        'base_price': 125,
        'price_8oz': 125,
        'price_12oz': 145,
        'price_16oz': 165,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Customer favorite with Creamy Carbonara!'
    },
    {
        'id': 'esp-7',
        'category': 'espresso',
        'name': 'Dirty Matcha',
        'desc': 'Premium ceremonial grade matcha latte spiked with a fresh espresso shot.',
        'base_price': 155,
        'price_8oz': 155,
        'price_12oz': 175,
        'price_16oz': 195,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'A unique boost alongside Ham & Cheese.'
    },
    {
        'id': 'esp-8',
        'category': 'espresso',
        'name': 'Salted Caramel Macchiato',
        'desc': 'Sweet caramel latte finished with sea salt cream accents.',
        'base_price': 125,
        'price_8oz': 125,
        'price_12oz': 145,
        'price_16oz': 165,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Pairs delightfully with Pinoy Spaghetti.'
    },
    {
        'id': 'esp-9',
        'category': 'espresso',
        'name': 'Hazelnut Mocha',
        'desc': 'Chocolate mocha enhanced with nutty hazelnut syrup.',
        'base_price': 125,
        'price_8oz': 125,
        'price_12oz': 145,
        'price_16oz': 165,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Satisfying drink with Special Cassava.'
    },
    {
        'id': 'esp-10',
        'category': 'espresso',
        'name': 'Spanish Latte',
        'desc': 'Creamy espresso sweetened with condensed milk for a rich velvet finish.',
        'base_price': 125,
        'price_8oz': 125,
        'price_12oz': 145,
        'price_16oz': 165,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Top bestseller paired with Creamy Carbonara!'
    },
    {
        'id': 'esp-11',
        'category': 'espresso',
        'name': 'Pistachio Latte',
        'desc': 'Luxurious espresso with roasted pistachio cream flavor.',
        'base_price': 155,
        'price_8oz': 155,
        'price_12oz': 175,
        'price_16oz': 195,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Pairs wonderfully with Ham & Cheese.'
    },
    {
        'id': 'esp-12',
        'category': 'espresso',
        'name': 'White Chocolate Mocha',
        'desc': 'Espresso with sweet white chocolate sauce and creamy milk.',
        'base_price': 125,
        'price_8oz': 125,
        'price_12oz': 145,
        'price_16oz': 165,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 1,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Great treat alongside Pinoy Spaghetti.'
    },

    # --- MILK-BASED ---
    {
        'id': 'milk-1',
        'category': 'milk',
        'name': 'Biscoff Cheesecake w/scc',
        'desc': 'Creamy milk with Lotus Biscoff flavor topped with salted cream cheese.',
        'base_price': 155,
        'price_8oz': 155,
        'price_12oz': 155,
        'price_16oz': 175,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Decadent pairing with Ham & Cheese!'
    },
    {
        'id': 'milk-2',
        'category': 'milk',
        'name': 'Milo Dinosaur',
        'desc': 'Iced chocolate malt milk crowned with extra rich Milo powder.',
        'base_price': 115,
        'price_8oz': 115,
        'price_12oz': 135,
        'price_16oz': 155,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Classic favorite for Pinoy Spaghetti lovers.'
    },
    {
        'id': 'milk-3',
        'category': 'milk',
        'name': 'Dark Chocolate Lava',
        'desc': 'Deep dark chocolate infusion melted into chilled whole milk.',
        'base_price': 115,
        'price_8oz': 115,
        'price_12oz': 135,
        'price_16oz': 155,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Pairs great with Special Cassava!'
    },
    {
        'id': 'milk-4',
        'category': 'milk',
        'name': 'Matcha Latte',
        'desc': 'Smooth japanese green tea matcha whisked with fresh milk.',
        'base_price': 125,
        'price_8oz': 125,
        'price_12oz': 145,
        'price_16oz': 165,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Refreshing with Creamy Carbonara.'
    },
    {
        'id': 'milk-5',
        'category': 'milk',
        'name': 'Matcha Cheesecake w/scc',
        'desc': 'Japanese matcha with cheesecake notes & salted cream cheese layer.',
        'base_price': 165,
        'price_8oz': 165,
        'price_12oz': 165,
        'price_16oz': 185,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Try with Special Cassava!'
    },
    {
        'id': 'milk-6',
        'category': 'milk',
        'name': 'Nutella Cheesecake w/scc',
        'desc': 'Hazelnut Nutella cheesecake milk drink topped with salted cream cheese.',
        'base_price': 155,
        'price_8oz': 155,
        'price_12oz': 155,
        'price_16oz': 175,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Delicious alongside Ham & Cheese.'
    },
    {
        'id': 'milk-7',
        'category': 'milk',
        'name': 'Pistachio Cheesecake w/scc',
        'desc': 'Rich pistachio milk blend crowned with savory salted cream cheese.',
        'base_price': 175,
        'price_8oz': 175,
        'price_12oz': 175,
        'price_16oz': 195,
        'has_sizes': 1,
        'has_milk': 1,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Premium indulge with Creamy Carbonara!'
    },

    # --- ICECREAM-BASED FRAPPE ---
    {
        'id': 'frappe-1',
        'category': 'frappe',
        'name': 'Dark Mocha Frappe',
        'desc': 'Blended ice cream frappe with espresso shot and rich dark mocha.',
        'base_price': 175,
        'price_8oz': None,
        'price_12oz': 175,
        'price_16oz': 205,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Perfect cold treat with Ham & Cheese!'
    },
    {
        'id': 'frappe-2',
        'category': 'frappe',
        'name': 'Espresso Vanilla Frappe',
        'desc': 'Vanilla ice cream blended with fresh espresso shot.',
        'base_price': 165,
        'price_8oz': None,
        'price_12oz': 165,
        'price_16oz': 195,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 1,
        'pairing_recommendation': 'Pairs with Special Cassava!'
    },
    {
        'id': 'frappe-3',
        'category': 'frappe',
        'name': 'Chocolate Chips Frappe',
        'desc': 'Creamy chocolate ice cream blended with crunchy chocolate chips.',
        'base_price': 165,
        'price_8oz': None,
        'price_12oz': 165,
        'price_16oz': 195,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Great combo with Pinoy Spaghetti.'
    },
    {
        'id': 'frappe-4',
        'category': 'frappe',
        'name': 'Biscoff Cheesecake Frappe',
        'desc': 'Blended ice cream frappe loaded with Lotus Biscoff and cheesecake.',
        'base_price': 175,
        'price_8oz': None,
        'price_12oz': 175,
        'price_16oz': 205,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Indulgent match with Creamy Carbonara!'
    },
    {
        'id': 'frappe-5',
        'category': 'frappe',
        'name': 'Oreo Tiramisu Frappe',
        'desc': 'Crushed Oreo cookies and coffee tiramisu blended ice cream frappe.',
        'base_price': 165,
        'price_8oz': None,
        'price_12oz': 165,
        'price_16oz': 195,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Awesome dessert frappe!'
    },
    {
        'id': 'frappe-6',
        'category': 'frappe',
        'name': 'Ube Cheese Frappe',
        'desc': 'Filipino purple yam (ube) and cheese blended ice cream frappe.',
        'base_price': 165,
        'price_8oz': None,
        'price_12oz': 165,
        'price_16oz': 195,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Authentic Pinoy flavor pairing with Special Cassava!'
    },
    {
        'id': 'frappe-7',
        'category': 'frappe',
        'name': 'Strawberry & Cream Frappe',
        'desc': 'Real strawberry puree blended with vanilla ice cream and cream topping.',
        'base_price': 175,
        'price_8oz': None,
        'price_12oz': 175,
        'price_16oz': 205,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Fruity favorite with Ham & Cheese!'
    },
    {
        'id': 'frappe-8',
        'category': 'frappe',
        'name': 'Nutella Cheesecake Frappe',
        'desc': 'Rich Nutella chocolate hazelnut and cheesecake ice cream blend.',
        'base_price': 175,
        'price_8oz': None,
        'price_12oz': 175,
        'price_16oz': 205,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Decadent delight with Creamy Carbonara.'
    },
    {
        'id': 'frappe-9',
        'category': 'frappe',
        'name': 'Matchamisu Frappe',
        'desc': 'Matcha green tea meets tiramisu ice cream frappe fusion.',
        'base_price': 165,
        'price_8oz': None,
        'price_12oz': 165,
        'price_16oz': 195,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Pairs nicely with Special Cassava!'
    },
    {
        'id': 'frappe-10',
        'category': 'frappe',
        'name': 'Mango Graham Frappe',
        'desc': 'Tropical Philippine mango blended with graham crumbs and cream.',
        'base_price': 165,
        'price_8oz': None,
        'price_12oz': 165,
        'price_16oz': 195,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Top Pinoy favorite with Pinoy Spaghetti!'
    },
    {
        'id': 'frappe-11',
        'category': 'frappe',
        'name': 'Pistachio Cheesecake Frappe',
        'desc': 'Premium pistachio nuts blended with cheesecake ice cream.',
        'base_price': 195,
        'price_8oz': None,
        'price_12oz': 195,
        'price_16oz': 225,
        'has_sizes': 1,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Ultra rich frappe treat!'
    },

    # --- QUICK BITES ---
    {
        'id': 'bites-1',
        'category': 'quickbites',
        'name': 'Creamy Carbonara',
        'desc': 'Rich pasta in savory white cream sauce topped with parmesan and crisp bacon bits.',
        'base_price': 135,
        'price_8oz': None,
        'price_12oz': None,
        'price_16oz': None,
        'has_sizes': 0,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Pairs amazingly with Spanish Latte or Biscoff Latte!'
    },
    {
        'id': 'bites-2',
        'category': 'quickbites',
        'name': 'Pinoy Spaghetti',
        'desc': 'Classic Filipino style sweet savory spaghetti topped with hotdogs & melted cheese.',
        'base_price': 125,
        'price_8oz': None,
        'price_12oz': None,
        'price_16oz': None,
        'has_sizes': 0,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Great match with Milo Dinosaur or Mango Graham Frappe!'
    },
    {
        'id': 'bites-3',
        'category': 'quickbites',
        'name': 'Special Cassava',
        'desc': 'Traditional baked Filipino cassava cake topped with rich caramel cheese glaze.',
        'base_price': 85,
        'price_8oz': None,
        'price_12oz': None,
        'price_16oz': None,
        'has_sizes': 0,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Enjoy with Americano or Ube Cheese Frappe!'
    },
    {
        'id': 'bites-4',
        'category': 'quickbites',
        'name': 'Ham & Cheese',
        'desc': 'Warm toasted sandwich stuffed with savory ham slices and melted cheddar cheese.',
        'base_price': 115,
        'price_8oz': None,
        'price_12oz': None,
        'price_16oz': None,
        'has_sizes': 0,
        'has_milk': 0,
        'has_syrups': 0,
        'has_extra_shot': 0,
        'pairing_recommendation': 'Best pairing with Cafe Latte or Dirty Matcha!'
    }
]

def migrate_from_sqlite_if_needed(db):
    """Migrate existing records from legacy SQLite cafe.db into MongoDB collections once."""
    if not os.path.exists(DB_PATH):
        return

    # Only run migration if MongoDB orders & users collections are empty
    if db.orders.count_documents({}) > 0 or db.users.count_documents({}) > 0:
        return

    print("[MongoDB Migration] Migrating existing data from cafe.db into MongoDB...")
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        existing_tables = {
            r[0]
            for r in cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        }

        # 1. Menu Items
        if 'menu_items' in existing_tables:
            rows = [dict(r) for r in cursor.execute("SELECT * FROM menu_items").fetchall()]
            for r in rows:
                r.setdefault('is_available', 1)
                db.menu_items.replace_one({'id': r['id']}, r, upsert=True)
            print(f"  - Migrated {len(rows)} menu_items documents.")

        # 2. Users
        if 'users' in existing_tables:
            rows = [dict(r) for r in cursor.execute("SELECT * FROM users").fetchall()]
            max_id = 0
            for r in rows:
                r['id'] = int(r['id'])
                r.setdefault('email', '')
                r.setdefault('phone', '')
                r.setdefault('delivery_address', '')
                r.setdefault('created_at', now_str())
                if r['id'] > max_id:
                    max_id = r['id']
                db.users.replace_one({'id': r['id']}, r, upsert=True)
            sync_sequence('users', max_id)
            print(f"  - Migrated {len(rows)} users documents.")

        # 3. User Sessions
        if 'user_sessions' in existing_tables:
            rows = [dict(r) for r in cursor.execute("SELECT * FROM user_sessions").fetchall()]
            for r in rows:
                r['user_id'] = int(r['user_id'])
                r.setdefault('created_at', now_str())
                db.user_sessions.replace_one({'token': r['token']}, r, upsert=True)
            print(f"  - Migrated {len(rows)} user_sessions documents.")

        # 4. Order Items (load first so we can also embed into orders)
        order_items_by_order = {}
        if 'order_items' in existing_tables:
            rows = [dict(r) for r in cursor.execute("SELECT * FROM order_items").fetchall()]
            max_id = 0
            for r in rows:
                r['id'] = int(r['id'])
                r['order_id'] = int(r['order_id'])
                r['unit_price'] = float(r.get('unit_price') or 0.0)
                r['quantity'] = int(r.get('quantity') or 1)
                if r['id'] > max_id:
                    max_id = r['id']
                db.order_items.replace_one({'id': r['id']}, r, upsert=True)
                order_items_by_order.setdefault(r['order_id'], []).append({
                    'id': r['id'],
                    'item_name': r['item_name'],
                    'custom_options': r.get('custom_options') or '',
                    'unit_price': r['unit_price'],
                    'quantity': r['quantity']
                })
            sync_sequence('order_items', max_id)
            print(f"  - Migrated {len(rows)} order_items documents.")

        # 5. Orders
        if 'orders' in existing_tables:
            rows = [dict(r) for r in cursor.execute("SELECT * FROM orders").fetchall()]
            max_id = 0
            for r in rows:
                r['id'] = int(r['id'])
                r['subtotal'] = float(r.get('subtotal') or 0.0)
                r['tax'] = float(r.get('tax') or 0.0)
                r['total'] = float(r.get('total') or 0.0)
                r.setdefault('status', 'Pending')
                r.setdefault('delivery_address', '')
                r.setdefault('delivery_lat', None)
                r.setdefault('delivery_lng', None)
                r.setdefault('delivery_maps_url', '')
                r.setdefault('delivery_notes', '')
                r.setdefault('payment_method', 'Cash')
                r.setdefault('payment_reference', '')
                r.setdefault('payment_status', 'Pending')
                r.setdefault('payment_receipt', '')
                r.setdefault('user_id', None)
                r.setdefault('created_at', now_str())
                r['items'] = order_items_by_order.get(r['id'], [])
                if r['id'] > max_id:
                    max_id = r['id']
                db.orders.replace_one({'id': r['id']}, r, upsert=True)
            sync_sequence('orders', max_id)
            print(f"  - Migrated {len(rows)} orders documents (with embedded items).")

        # 6. Reviews
        if 'reviews' in existing_tables:
            rows = [dict(r) for r in cursor.execute("SELECT * FROM reviews").fetchall()]
            max_id = 0
            for r in rows:
                r['id'] = int(r['id'])
                r['rating'] = int(r.get('rating') or 5)
                r['is_approved'] = int(r.get('is_approved', 1))
                r.setdefault('created_at', now_str())
                if r['id'] > max_id:
                    max_id = r['id']
                db.reviews.replace_one({'id': r['id']}, r, upsert=True)
            sync_sequence('reviews', max_id)
            print(f"  - Migrated {len(rows)} reviews documents.")

        # 7. Loyalty Members
        if 'loyalty_members' in existing_tables:
            rows = [dict(r) for r in cursor.execute("SELECT * FROM loyalty_members").fetchall()]
            max_id = 0
            for r in rows:
                r['id'] = int(r['id'])
                r['points'] = int(r.get('points') or 0)
                r['total_spent'] = float(r.get('total_spent') or 0.0)
                r.setdefault('created_at', now_str())
                if r['id'] > max_id:
                    max_id = r['id']
                db.loyalty_members.replace_one({'id': r['id']}, r, upsert=True)
            sync_sequence('loyalty_members', max_id)
            print(f"  - Migrated {len(rows)} loyalty_members documents.")

        # 8. Chat Messages
        if 'chat_messages' in existing_tables:
            rows = [dict(r) for r in cursor.execute("SELECT * FROM chat_messages").fetchall()]
            max_id = 0
            for r in rows:
                r['id'] = int(r['id'])
                r['is_read'] = int(r.get('is_read') or 0)
                r.setdefault('created_at', now_str())
                if r['id'] > max_id:
                    max_id = r['id']
                db.chat_messages.replace_one({'id': r['id']}, r, upsert=True)
            sync_sequence('chat_messages', max_id)
            print(f"  - Migrated {len(rows)} chat_messages documents.")

        conn.close()
        save_local_store()
        print("[MongoDB Migration] Successfully migrated all legacy SQLite data to MongoDB.")
    except Exception as e:
        print(f"[MongoDB Migration Warning] {e}")


DEFAULT_CATEGORIES = [
    {
        'id': 'cat-espresso',
        'slug': 'espresso',
        'name': 'Espresso-Based',
        'description': 'Handcrafted specialty espresso drinks pulled with freshly roasted Arabica-Robusta beans.'
    },
    {
        'id': 'cat-milk',
        'slug': 'milk',
        'name': 'Milk-Based',
        'description': 'Caffeine-free or low-caffeine creamy milk drinks topped with signature salted cream cheese.'
    },
    {
        'id': 'cat-frappe',
        'slug': 'frappe',
        'name': 'Ice Cream Frappe',
        'description': 'Indulgent ice-cream blended frappes crowned with whipped cream and gourmet toppings.'
    },
    {
        'id': 'cat-quickbites',
        'slug': 'quickbites',
        'name': 'Quick Bites',
        'description': 'Savory pasta, warm toasted sandwiches, and authentic Filipino merienda favorites.'
    }
]


def ensure_3nf_normalization(db):
    """Ensure all 1NF, 2NF, and 3NF normalized collections and foreign keys are populated."""
    # 1. Seed Categories Lookup Collection (3NF)
    cat_by_slug = {}
    for cat in DEFAULT_CATEGORIES:
        db.categories.replace_one({'id': cat['id']}, cat, upsert=True)
        cat_by_slug[cat['slug']] = cat['id']

    # 2. Link menu_items -> categories.id (category_id) & populate menu_item_sizes (1NF/3NF)
    all_menu = list(db.menu_items.find({}))
    menu_by_name = {}
    for item in all_menu:
        item_id = item['id']
        slug = item.get('category', 'espresso')
        cat_id = cat_by_slug.get(slug, 'cat-espresso')
        if item.get('category_id') != cat_id:
            db.menu_items.update_one({'id': item_id}, {'$set': {'category_id': cat_id}})
        menu_by_name[item['name'].lower()] = item_id

        # Populate normalized menu_item_sizes if not already present for this item
        if db.menu_item_sizes.count_documents({'menu_item_id': item_id}) == 0:
            if item.get('has_sizes'):
                for sz_label, field in [('8oz', 'price_8oz'), ('12oz', 'price_12oz'), ('16oz', 'price_16oz')]:
                    val = item.get(field)
                    if val is not None:
                        sz_id = get_next_sequence('menu_item_sizes')
                        db.menu_item_sizes.insert_one({
                            'id': sz_id,
                            'menu_item_id': item_id,
                            'size_label': sz_label,
                            'price': float(val)
                        })
            else:
                sz_id = get_next_sequence('menu_item_sizes')
                db.menu_item_sizes.insert_one({
                    'id': sz_id,
                    'menu_item_id': item_id,
                    'size_label': 'Standard',
                    'price': float(item.get('base_price') or 0.0)
                })

    # 3. Link order_items -> menu_items.id (menu_item_id) & populate order_item_options (1NF/3NF)
    def resolve_menu_item_id(raw_name: str):
        low = (raw_name or '').lower().strip()
        if low in menu_by_name:
            return menu_by_name[low]
        for m_name, m_id in menu_by_name.items():
            if m_name in low:
                return m_id
        return None

    for oi in list(db.order_items.find({})):
        oi_id = oi['id']
        resolved_mid = oi.get('menu_item_id') or resolve_menu_item_id(oi.get('item_name', ''))
        if resolved_mid and oi.get('menu_item_id') != resolved_mid:
            db.order_items.update_one({'id': oi_id}, {'$set': {'menu_item_id': resolved_mid}})

        # Normalize comma-separated custom_options into atomic rows in order_item_options
        raw_opts = (oi.get('custom_options') or '').strip()
        if raw_opts and db.order_item_options.count_documents({'order_item_id': oi_id}) == 0:
            parts = [p.strip() for p in raw_opts.replace('|', ',').split(',') if p.strip()]
            for part in parts:
                opt_id = get_next_sequence('order_item_options')
                db.order_item_options.insert_one({
                    'id': opt_id,
                    'order_item_id': oi_id,
                    'option_value': part
                })

    # 4. Populate chat_sessions parent table (3NF) so customer_name depends on session_id
    all_msgs = list(db.chat_messages.find({}).sort('id', 1))
    sessions_grouped = {}
    for m in all_msgs:
        sid = m['session_id']
        if sid not in sessions_grouped:
            sessions_grouped[sid] = {
                'session_id': sid,
                'customer_name': m.get('customer_name') or 'Guest',
                'user_id': m.get('user_id'),
                'created_at': m.get('created_at') or now_str(),
                'updated_at': m.get('created_at') or now_str()
            }
        if m.get('sender') == 'customer' and m.get('customer_name') and m.get('customer_name') != 'Staff Barista':
            sessions_grouped[sid]['customer_name'] = m['customer_name']
        sessions_grouped[sid]['updated_at'] = m.get('created_at') or sessions_grouped[sid]['updated_at']

    for sid, sdoc in sessions_grouped.items():
        db.chat_sessions.replace_one({'session_id': sid}, sdoc, upsert=True)

    # 5. Link loyalty_members -> users.id (user_id) where matching name/phone exists
    all_users = list(db.users.find({}))
    for lm in list(db.loyalty_members.find({})):
        if 'user_id' not in lm or lm.get('user_id') is None:
            matched_uid = None
            for u in all_users:
                if (u.get('phone') and u['phone'] == lm.get('phone')) or (
                    u.get('full_name', '').lower() == lm.get('name', '').lower()
                ):
                    matched_uid = u['id']
                    break
            db.loyalty_members.update_one({'id': lm['id']}, {'$set': {'user_id': matched_uid}})


def init_db():
    db = get_db()

    # Create MongoDB indexes for fast lookup
    try:
        db.categories.create_index("id", unique=True)
        db.menu_items.create_index("id", unique=True)
        db.menu_items.create_index("category_id")
        db.menu_item_sizes.create_index("id", unique=True)
        db.menu_item_sizes.create_index("menu_item_id")
        db.users.create_index("id", unique=True)
        db.users.create_index("username", unique=True)
        db.user_sessions.create_index("token", unique=True)
        db.orders.create_index("id", unique=True)
        db.order_items.create_index("id", unique=True)
        db.order_items.create_index("order_id")
        db.order_items.create_index("menu_item_id")
        db.order_item_options.create_index("id", unique=True)
        db.order_item_options.create_index("order_item_id")
        db.reviews.create_index("id", unique=True)
        db.chat_sessions.create_index("session_id", unique=True)
        db.chat_messages.create_index("id", unique=True)
        db.chat_messages.create_index("session_id")
    except Exception:
        pass

    # Migrate existing cafe.db records into MongoDB if needed
    migrate_from_sqlite_if_needed(db)

    DEFAULT_REVIEWS = [
        {
            'customer_name': 'Maria Santos',
            'rating': 5,
            'comment': 'The Spanish Latte and Creamy Carbonara are unmatched in Davao! Perfect atmosphere for working and slow mornings.',
            'favorite_item': 'Spanish Latte'
        },
        {
            'customer_name': 'Dave Tan',
            'rating': 5,
            'comment': 'Fast delivery and the Biscoff Latte was still icy cold when it arrived. The Build Your Own Coffee feature is amazing!',
            'favorite_item': 'Biscoff Latte'
        },
        {
            'customer_name': 'Angela Cruz',
            'rating': 5,
            'comment': 'Cozy spot in Communal Road! Staff is so welcoming and the Special Cassava cake is super rich and authentic.',
            'favorite_item': 'Special Cassava'
        },
        {
            'customer_name': 'Kenji Takahashi',
            'rating': 5,
            'comment': 'AI Barista recommended the Dark Velvet Blackout with Oat Milk — mind blown! 10/10 coffee quality.',
            'favorite_item': 'Dirty Matcha'
        }
    ]

    if db.reviews.count_documents({}) == 0:
        for r in DEFAULT_REVIEWS:
            rev_id = get_next_sequence('reviews')
            db.reviews.insert_one({
                'id': rev_id,
                'customer_name': r['customer_name'],
                'rating': r['rating'],
                'comment': r['comment'],
                'favorite_item': r['favorite_item'],
                'is_approved': 1,
                'created_at': now_str()
            })
        print("MongoDB seeded with customer reviews.")

    for item in DEFAULT_MENU:
        if not db.menu_items.find_one({'id': item['id']}):
            doc = dict(item)
            doc.setdefault('is_available', 1)
            db.menu_items.insert_one(doc)
    print("MongoDB verified with Jules Cafe Philippine menu catalog.")

    # Seed default users if missing
    for u in DEFAULT_USERS:
        if not db.users.find_one({'username': u['username']}):
            pw_hash = hash_password(u['password'])
            user_id = get_next_sequence('users')
            db.users.insert_one({
                'id': user_id,
                'username': u['username'],
                'password_hash': pw_hash,
                'full_name': u['full_name'],
                'role': u['role'],
                'email': '',
                'phone': '',
                'delivery_address': '',
                'created_at': now_str()
            })
    print("MongoDB verified with default Admin, Staff, and Employee accounts.")

    # Build and verify 1NF, 2NF, and 3NF normalized collections & foreign keys
    ensure_3nf_normalization(db)

    # Ensure sequence counters are synced with current max IDs
    for seq_coll in ['users', 'orders', 'order_items', 'order_item_options', 'menu_item_sizes', 'reviews', 'loyalty_members', 'chat_messages']:
        top_doc = db[seq_coll].find_one(sort=[('id', -1)])
        if top_doc and 'id' in top_doc:
            sync_sequence(seq_coll, int(top_doc['id']))

    save_local_store()
    print("MongoDB 3NF initialization complete.")


if __name__ == '__main__':
    init_db()

