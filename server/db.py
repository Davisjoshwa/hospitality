import os
import urllib.parse as urlparse
import pg8000.dbapi
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise ValueError("DATABASE_URL environment variable is not configured.")
        
    url = urlparse.urlparse(db_url)
    username = url.username
    password = url.password
    database = url.path[1:] # strip leading slash
    hostname = url.hostname
    port = url.port or 5432
    
    # Establish connection using pure Python pg8000 driver
    conn = pg8000.dbapi.connect(
        user=username,
        password=password,
        host=hostname,
        port=int(port),
        database=database
    )
    return conn

# Helper utility to execute SQL queries and return rows as dictionaries
def execute_query(query, params=None, fetch=True, commit=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, params or ())
        
        result = None
        if fetch:
            columns = [desc[0] for desc in cursor.description]
            result = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
        if commit:
            conn.commit()
            
        return result
    except Exception as e:
        if commit:
            conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()
