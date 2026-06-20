"""Quick test to verify Gmail SMTP is working"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'server'))

from dotenv import load_dotenv
load_dotenv('server/.env')

from utils.email import send_otp_email

print("Testing Gmail SMTP...")
result = send_otp_email("davisjoshwa7@gmail.com", "123456", "Davis")
print(f"Result: {'Success - email sent!' if result else 'Failed'}")
