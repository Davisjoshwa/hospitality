import pg8000.dbapi
import sys

def create_database():
    print("Connecting to PostgreSQL...")
    try:
        conn = pg8000.dbapi.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="davis10joshwa",
            database="postgres"
        )
        conn.autocommit = True
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'hospihire'")
        exists = cursor.fetchone()
        if exists:
            print("Database 'hospihire' already exists!")
        else:
            cursor.execute("CREATE DATABASE hospihire")
            print("Database 'hospihire' created successfully!")
        cursor.close()
        conn.close()
        print("Done.")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = create_database()
    sys.exit(0 if success else 1)
