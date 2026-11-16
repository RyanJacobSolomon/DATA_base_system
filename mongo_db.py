import os
import json
import time
import socket
import subprocess
import datetime
import threading
import pymongo
from pymongo import ReturnDocument
import mongomock

DEFAULT_MONGO_URI = "mongodb://localhost:27017/"
DEFAULT_DB_NAME = "jules_cafe"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_STORE_DIR = os.path.join(BASE_DIR, "mongo_data")
LOCAL_STORE_FILE = os.path.join(LOCAL_STORE_DIR, "jules_cafe_collections.json")
MONGO_DBPATH = os.path.join(LOCAL_STORE_DIR, "db")
MONGO_LOGPATH = os.path.join(LOCAL_STORE_DIR, "mongod.log")
MONGOD_EXE = os.path.join(BASE_DIR, "mongodb_bin", "mongod.exe")

_client = None
_db = None
_is_live_mongo = False
_store_lock = threading.RLock()

COLLECTION_NAMES = [
    "counters",
    "categories",
    "menu_items",
    "menu_item_sizes",
    "users",
    "user_sessions",
    "orders",
    "order_items",
    "order_item_options",
    "chat_sessions",
    "chat_messages",
    "reviews",
    "loyalty_members",
]


def now_str() -> str:
    """Return current timestamp in standard YYYY-MM-DD HH:MM:SS format."""
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def get_mongo_config():
    uri = os.environ.get("MONGODB_URI", DEFAULT_MONGO_URI).strip() or DEFAULT_MONGO_URI
    db_name = os.environ.get("MONGODB_DB_NAME", DEFAULT_DB_NAME).strip() or DEFAULT_DB_NAME
    return uri, db_name


def _serialize_doc(doc: dict) -> dict:
    """Convert a MongoDB document into JSON-serializable dict (stripping ObjectId _id unless string/int)."""
    out = {}
    for k, v in doc.items():
        if k == "_id":
            if isinstance(v, (str, int, float)):
                out[k] = v
            continue
        if isinstance(v, datetime.datetime):
            out[k] = v.strftime("%Y-%m-%d %H:%M:%S")
        else:
            out[k] = v
    return out


def save_local_store(db=None):
    """Persist collections to mongo_data/jules_cafe_collections.json so data is always durable."""
    target_db = db if db is not None else _db
    if target_db is None:
        return
    with _store_lock:
        try:
            os.makedirs(LOCAL_STORE_DIR, exist_ok=True)
            dump = {}
            for coll_name in COLLECTION_NAMES:
                coll = target_db[coll_name]
                docs = [_serialize_doc(d) for d in coll.find({})]
                dump[coll_name] = docs
            temp_path = LOCAL_STORE_FILE + ".tmp"
            with open(temp_path, "w", encoding="utf-8") as f:
                json.dump(dump, f, indent=2, ensure_ascii=False)
            os.replace(temp_path, LOCAL_STORE_FILE)
        except Exception as e:
            print(f"[MongoDB Local Store Save Notice] {e}")


def load_local_store_into(target_db) -> bool:
    """Load persisted JSON collection documents into target_db if Local Store file exists."""
    if not os.path.exists(LOCAL_STORE_FILE):
        return False
    with _store_lock:
        try:
            with open(LOCAL_STORE_FILE, "r", encoding="utf-8") as f:
                dump = json.load(f)
            loaded_any = False
            for coll_name, docs in dump.items():
                if isinstance(docs, list) and len(docs) > 0:
                    coll = target_db[coll_name]
                    if coll.count_documents({}) == 0:
                        coll.insert_many(docs)
                        loaded_any = True
            return loaded_any
        except Exception as e:
            print(f"[MongoDB Local Store Load Notice] {e}")
            return False


class PersistentCollectionProxy:
    """Wraps a MongoDB/mongomock collection to auto-persist write operations to disk."""

    WRITE_METHODS = {
        "insert_one",
        "insert_many",
        "update_one",
        "update_many",
        "replace_one",
        "delete_one",
        "delete_many",
        "find_one_and_update",
        "find_one_and_replace",
        "find_one_and_delete",
    }

    def __init__(self, collection, db_proxy):
        self._collection = collection
        self._db_proxy = db_proxy

    def __getattr__(self, name):
        attr = getattr(self._collection, name)
        if callable(attr) and name in self.WRITE_METHODS:
            def wrapper(*args, **kwargs):
                result = attr(*args, **kwargs)
                save_local_store(self._db_proxy._raw_db)
                return result
            return wrapper
        return attr


class PersistentDatabaseProxy:
    """Wraps a MongoDB/mongomock database so collection accesses return PersistentCollectionProxy."""

    def __init__(self, raw_db):
        self._raw_db = raw_db

    def __getitem__(self, name):
        return PersistentCollectionProxy(self._raw_db[name], self)

    def __getattr__(self, name):
        if name.startswith("_"):
            return object.__getattribute__(self, name)
        if name in ("list_collection_names", "command", "name", "client"):
            return getattr(self._raw_db, name)
        return PersistentCollectionProxy(self._raw_db[name], self)


def _ensure_local_mongod_running():
    """If localhost:27017 is not open and mongodb_bin/mongod.exe exists, start mongod automatically."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        if s.connect_ex(("127.0.0.1", 27017)) == 0:
            s.close()
            return True
        s.close()
    except Exception:
        pass

    if os.path.exists(MONGOD_EXE):
        try:
            os.makedirs(MONGO_DBPATH, exist_ok=True)
            creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000) | getattr(
                subprocess, "DETACHED_PROCESS", 0x00000008
            )
            subprocess.Popen(
                [
                    MONGOD_EXE,
                    "--dbpath",
                    MONGO_DBPATH,
                    "--logpath",
                    MONGO_LOGPATH,
                    "--logappend",
                    "--bind_ip",
                    "127.0.0.1",
                    "--port",
                    "27017",
                ],
                creationflags=creationflags,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            for _ in range(16):
                time.sleep(0.25)
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.3)
                if s.connect_ex(("127.0.0.1", 27017)) == 0:
                    s.close()
                    return True
                s.close()
        except Exception as e:
            print(f"[MongoDB Auto-Start Notice] {e}")
    return False


def get_db():
    """Return the active MongoDB database connection."""
    global _client, _db, _is_live_mongo
    if _db is not None:
        return _db

    uri, db_name = get_mongo_config()
    if "localhost:27017" in uri or "127.0.0.1:27017" in uri:
        _ensure_local_mongod_running()

    try:
        client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=2500, connectTimeoutMS=2500)
        client.admin.command("ping")
        _client = client
        raw_db = client[db_name]
        _is_live_mongo = True
        # If live MongoDB is empty but we have local store data, sync it in automatically
        load_local_store_into(raw_db)
        _db = PersistentDatabaseProxy(raw_db)
        print(f"[MongoDB] Connected to live MongoDB server at {uri} (Database: {db_name})")
    except Exception:
        _client = mongomock.MongoClient()
        raw_db = _client[db_name]
        _is_live_mongo = False
        load_local_store_into(raw_db)
        _db = PersistentDatabaseProxy(raw_db)
        print(
            f"[MongoDB] Local mongod service not detected on {uri}; using PyMongo-compatible "
            f"persistent MongoDB document store ({LOCAL_STORE_FILE})"
        )

    return _db


def get_next_sequence(sequence_name: str) -> int:
    """Atomically increment and return the next integer ID for a given collection."""
    db = get_db()
    doc = db.counters.find_one_and_update(
        {"_id": sequence_name},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return int(doc["seq"])


def sync_sequence(sequence_name: str, min_value: int):
    """Ensure the sequence counter for sequence_name is at least min_value."""
    db = get_db()
    existing = db.counters.find_one({"_id": sequence_name})
    if not existing or int(existing.get("seq", 0)) < int(min_value):
        db.counters.find_one_and_update(
            {"_id": sequence_name},
            {"$set": {"seq": int(min_value)}},
            upsert=True,
        )


def get_db_status() -> dict:
    """Return diagnostic details about the MongoDB connection and collections."""
    db = get_db()
    uri, db_name = get_mongo_config()
    counts = {}
    for name in COLLECTION_NAMES:
        if name != "counters":
            counts[name] = db[name].count_documents({})
    return {
        "database_type": "MongoDB",
        "live_mongod_connected": _is_live_mongo,
        "uri": uri,
        "database_name": db_name,
        "persistent_json_mirror": LOCAL_STORE_FILE,
        "collections": counts,
    }
