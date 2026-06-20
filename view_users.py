"""
Helper script to view all registered users and OTP history in the PostgreSQL database.
Run with: python view_users.py
"""
import sys
import os
import dotenv

# Load database environment variables
dotenv.load_dotenv(os.path.join(os.path.dirname(__file__), 'server', '.env'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'server'))

from db import execute_query

def main():
    print("=" * 60)
    print("REGISTERED STUDENTS / CANDIDATES:")
    print("=" * 60)
    students = execute_query("SELECT id, name, email, phone, created_at FROM students ORDER BY id") or []
    for s in students:
        print(f"ID: {s['id']} | Name: {s['name']} | Email: {s['email']} | Phone: {s['phone']} | Registered: {s['created_at']}")
    
    print("\n" + "=" * 60)
    print("REGISTERED RECRUITERS / HOTELS:")
    print("=" * 60)
    hotels = execute_query("SELECT id, company_name, email, phone, location, created_at FROM hotels ORDER BY id") or []
    for h in hotels:
        print(f"ID: {h['id']} | Company: {h['company_name']} | Email: {h['email']} | Phone: {h['phone']} | Location: {h['location']} | Registered: {h['created_at']}")
        
    print("\n" + "=" * 60)
    print("OTP CODE HISTORY (Last 10):")
    print("=" * 60)
    otps = execute_query("SELECT id, user_email, otp_code, expires_at, used, created_at FROM otp_codes ORDER BY created_at DESC LIMIT 10") or []
    for o in otps:
        status = "USED" if o['used'] else "UNUSED/EXPIRED"
        print(f"ID: {o['id']} | Email: {o['user_email']} | OTP: {o['otp_code']} | Status: status | Sent: {o['created_at']}")
    print("=" * 60)

if __name__ == "__main__":
    main()
