"""
SMS utility for sending OTP codes.
Since no commercial SMS gateway (like Twilio or MSG91) is configured,
it prints the SMS to the server console.
"""

def send_otp_sms(phone_number: str, otp_code: str) -> bool:
    """
    Send an OTP SMS to the user's phone number.
    Falls back to printing the SMS to the server console.
    """
    print("\n" + "=" * 55)
    print(f"  [SMS FALLBACK — GATEWAY NOT CONFIGURED]")
    print(f"  To Phone: {phone_number}")
    print(f"  OTP Code: {otp_code}")
    print("=" * 55 + "\n")
    return True
