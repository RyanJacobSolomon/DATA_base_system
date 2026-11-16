import json
import sys
from mongo_db import get_db, get_db_status, COLLECTION_NAMES


def main():
    status = get_db_status()
    print("=" * 65)
    print("  JULES CAFE — MONGODB DATABASE INSPECTOR")
    print("=" * 65)
    print(f"  Database Type       : {status['database_type']}")
    print(f"  MongoDB URI         : {status['uri']}")
    print(f"  Database Name       : {status['database_name']}")
    print(f"  Live mongod Running : {'YES (Connected to localhost:27017)' if status['live_mongod_connected'] else 'NO (Using Local Document Store Mirror)'}")
    print(f"  Local Mirror File   : {status['persistent_json_mirror']}")
    print("-" * 65)
    print("  COLLECTION DOCUMENT COUNTS:")
    for coll_name, count in status["collections"].items():
        print(f"    - {coll_name:<18}: {count} documents")
    print("=" * 65)

    # Optional argument: pass a collection name to view its documents
    db = get_db()
    if len(sys.argv) > 1:
        coll_name = sys.argv[1].strip()
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10
        if coll_name not in COLLECTION_NAMES:
            print(f"\nUnknown collection '{coll_name}'. Available collections: {', '.join(COLLECTION_NAMES)}")
            return
        docs = list(db[coll_name].find({}, {"_id": 0}).limit(limit))
        print(f"\nShowing up to {limit} documents from '{coll_name}':")
        print(json.dumps(docs, indent=2, ensure_ascii=False))
    else:
        print("\nTip: Run `python check_mongo.py <collection_name> [limit]` to view documents.")
        print("Example: python check_mongo.py orders 3")
        print("         python check_mongo.py menu_items 5")
        print("         python check_mongo.py users")


if __name__ == "__main__":
    main()
