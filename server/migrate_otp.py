"""
Migration script: Adds the otp_codes table to the hospihire database.
Run this once: python server/migrate_otp.py
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from db import execute_query

def run_migration():
    print("Running OTP migration...")
    
    # Create otp_codes table
    execute_query("""
        CREATE TABLE IF NOT EXISTS otp_codes (
            id SERIAL PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            otp_code VARCHAR(6) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """, commit=True, fetch=False)
    
    # Index for fast email lookups
    execute_query("""
        CREATE INDEX IF NOT EXISTS idx_otp_codes_email 
        ON otp_codes (user_email, used)
    """, commit=True, fetch=False)
    
    print("[OK] otp_codes table created successfully.")

if __name__ == "__main__":
    run_migration()
