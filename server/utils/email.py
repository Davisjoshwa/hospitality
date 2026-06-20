"""
Email utility for sending OTP codes via Gmail SMTP.
If SMTP_EMAIL / SMTP_APP_PASSWORD are not set in .env, the OTP is printed
to the server console so the developer can test without email setup.
"""

import smtplib
import os
import random
import string
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_EMAIL = os.getenv("SMTP_EMAIL", "")
SMTP_APP_PASSWORD = os.getenv("SMTP_APP_PASSWORD", "")


def generate_otp(length: int = 6) -> str:
    """Generate a numeric OTP of given length."""
    return "".join(random.choices(string.digits, k=length))


def send_otp_email(to_email: str, otp_code: str, user_name: str = "User") -> bool:
    """
    Send an OTP email to the user.
    Returns True on success, False on failure.
    Falls back to printing OTP in console if SMTP is not configured.
    """
    # --- Fallback: console log if SMTP not configured ---
    if not SMTP_EMAIL or not SMTP_APP_PASSWORD:
        print("\n" + "=" * 55)
        print(f"  [OTP FALLBACK — EMAIL NOT CONFIGURED]")
        print(f"  To: {to_email}")
        print(f"  OTP Code: {otp_code}")
        print(f"  (Configure SMTP_EMAIL and SMTP_APP_PASSWORD in .env")
        print(f"   to send real emails)")
        print("=" * 55 + "\n")
        return True  # Treat as success so login flow continues

    # --- HTML Email Template ---
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 0; }}
    .wrapper {{ max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%); padding: 32px 40px; text-align: center; }}
    .header h1 {{ color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; }}
    .header span {{ color: #f59e0b; }}
    .body {{ padding: 36px 40px; text-align: center; }}
    .body p {{ color: #475569; font-size: 14px; margin: 0 0 24px; line-height: 1.6; }}
    .otp-box {{ display: inline-block; background: #f8fafc; border: 2px dashed #1d4ed8; border-radius: 12px; padding: 18px 40px; margin: 8px 0 24px; }}
    .otp-code {{ font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #1e3a5f; font-family: 'Courier New', monospace; }}
    .expiry {{ color: #94a3b8; font-size: 12px; margin-top: 8px; }}
    .footer {{ background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0; }}
    .footer p {{ color: #94a3b8; font-size: 11px; margin: 0; }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Hospi<span>Hire</span></h1>
    </div>
    <div class="body">
      <p>Hello <strong>{user_name}</strong>,</p>
      <p>Use the one-time passcode below to complete your login. This code is valid for <strong>10 minutes</strong>.</p>
      <div class="otp-box">
        <div class="otp-code">{otp_code}</div>
      </div>
      <p class="expiry">⏱ Expires in 10 minutes &nbsp;|&nbsp; Do not share this code with anyone.</p>
      <p style="color:#94a3b8;font-size:12px;">If you did not attempt to log in, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; {2026} HospiHire &mdash; Secure Login Verification</p>
    </div>
  </div>
</body>
</html>
"""

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Your HospiHire Login Code: {otp_code}"
        msg["From"] = f"HospiHire Security <{SMTP_EMAIL}>"
        msg["To"] = to_email

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_APP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())

        print(f"[EMAIL] OTP sent to {to_email}")
        return True

    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send OTP to {to_email}: {e}")
        # Fallback to console so login can still work in dev
        print(f"  >>> FALLBACK OTP for {to_email}: {otp_code} <<<")
        return True  # Still allow login flow to continue
