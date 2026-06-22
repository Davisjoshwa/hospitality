from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime
import jwt
import os
import re
from passlib.hash import bcrypt
from email_validator import validate_email, EmailNotValidError
from db import execute_query
from middleware.auth import get_current_user
from utils.email import generate_otp, send_otp_email
from utils.sms import send_otp_sms

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("JWT_SECRET") or "supersecretjwtkeyhospihire2026"

def validate_password_strength(password: str) -> Optional[str]:
    """Returns an error message if password doesn't meet rules, else None."""
    if len(password) < 6:
        return "Password must be at least 6 characters long."
    return None

def create_access_token(user_id: int, role: str):
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    payload = {
        "id": user_id,
        "role": role,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def create_otp_token(email: str, role: str):
    """Short-lived token (15 min) that just carries email + role — used during OTP step."""
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
    payload = {
        "otp_email": email,
        "otp_role": role,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def decode_otp_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP session. Please log in again.")

# --- PYDANTIC SCHEMAS ---

class LoginRequest(BaseModel):
    emailOrPhone: str
    password: str

class OTPVerifyRequest(BaseModel):
    otp_token: str
    otp_code: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str  # 'student' | 'recruiter'
    phone: Optional[str] = None
    name: Optional[str] = None
    companyName: Optional[str] = None
    location: Optional[str] = None
    school: Optional[str] = None
    field_of_study: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    age_over_16: Optional[bool] = None
    job_title: Optional[str] = None
    interests: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    languages: Optional[str] = None
    education: Optional[str] = None
    eduGradYear: Optional[str] = None
    skills: Optional[List[str]] = None
    internships: Optional[List[dict]] = None
    certificates: Optional[List[str]] = None
    resumeName: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    school: Optional[str] = None
    startYear: Optional[int] = None
    endYear: Optional[int] = None
    jobTitle: Optional[str] = None
    avatar: Optional[str] = None
    interests: Optional[str] = None

# --- ENDPOINTS ---

# 1. REGISTER
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest):
    role = req.role
    if role not in ["student", "recruiter"]:
        raise HTTPException(status_code=400, detail="Invalid registration role.")

    # 1. Mail Condition
    try:
        email_info = validate_email(req.email, check_deliverability=True)
        req.email = email_info.normalized
    except EmailNotValidError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. Pass Condition
    pwd_error = validate_password_strength(req.password)
    if pwd_error:
        raise HTTPException(status_code=400, detail=pwd_error)

    # 3. Name Condition
    if role == "student":
        if not req.name or len(req.name.strip().split()) < 2:
            raise HTTPException(status_code=400, detail="For students, First and Last names are required.")
    elif role == "recruiter":
        if not req.companyName or not req.companyName.strip():
            raise HTTPException(status_code=400, detail="Company Name is required for recruiters.")

    if role == "recruiter" and not req.location:
        raise HTTPException(status_code=400, detail="Location is required for hotel recruiters.")

    # --- Server-side phone validation and normalization ---
    if req.phone:
        phone_cleaned = re.sub(r"[\s\-\+\(\)]", "", req.phone)
        if not re.match(r"^91\d{10}$", phone_cleaned):
            raise HTTPException(status_code=400, detail="Phone number must start with 91 followed by 10 digits (e.g. 919876543210).")
        req.phone = phone_cleaned

    # --- Server-side password strength check ---
    pw_error = validate_password_strength(req.password)
    if pw_error:
        raise HTTPException(status_code=400, detail=pw_error)

    try:
        # Check if email exists in any role table
        student_check = execute_query("SELECT id FROM students WHERE email = %s", (req.email,))
        hotel_check = execute_query("SELECT id FROM hotels WHERE email = %s", (req.email,))
        admin_check = execute_query("SELECT id FROM admins WHERE email = %s", (req.email,))

        if student_check or hotel_check or admin_check:
            raise HTTPException(status_code=400, detail="An account with this email already exists.")

        # Hash password
        password_hash = bcrypt.hash(req.password)

        user_id = None
        profile_data = {}

        if role == "student":
            res = execute_query(
                """INSERT INTO students (email, phone, password_hash, name, location, school, field_of_study, start_year, end_year, age_over_16, job_title, interests) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (req.email, req.phone, password_hash, req.name, req.location, req.school, req.field_of_study, req.start_year, req.end_year, req.age_over_16, req.job_title, req.interests),
                commit=True
            )
            user_id = res[0]["id"]
            profile_data = {"name": req.name}
        elif role == "recruiter":
            res = execute_query(
                """INSERT INTO hotels (email, phone, password_hash, company_name, job_title, location, is_verified, interests) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (req.email, req.phone, password_hash, req.companyName, req.job_title, req.location, True, req.interests),
                commit=True
            )
            user_id = res[0]["id"]
            profile_data = {"company": req.companyName, "location": req.location}

        # --- Generate & Send OTP to the user's registered email ---
        user_name = req.name or req.companyName or "User"
        otp_code = generate_otp()
        expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=10)

        execute_query(
            """INSERT INTO otp_codes (user_email, otp_code, expires_at, used)
               VALUES (%s, %s, %s, FALSE)""",
            (req.email, otp_code, expires_at),
            commit=True,
            fetch=False
        )

        send_otp_email(req.email, otp_code, user_name)
        if req.phone:
            send_otp_sms(req.phone, otp_code)

        otp_token = create_otp_token(req.email, role)

        return {
            "requires_otp": True,
            "otp_token": otp_token,
            "email": req.email,
            "message": f"Account created! An OTP has been sent to {req.email}"
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Registration server error:", e)
        raise HTTPException(status_code=500, detail="Server error during registration.")


# 2. LOGIN — Verify password and return token directly (no OTP)
@router.post("/login")
def login(req: LoginRequest):
    try:
        matched_user = None
        role = None
        profile_details = {}

        # Normalize and validate login input
        login_input = req.emailOrPhone.strip()
        is_email = "@" in login_input

        if is_email:
            allowed_domains = ["@gmail.com", "@cornell.edu", "@marriott.com", "@hospihire.com"]
            if not any(login_input.endswith(dom) for dom in allowed_domains):
                raise HTTPException(status_code=400, detail="Only Gmail addresses ending in @gmail.com are supported.")
        else:
            # Phone number validation
            login_input = re.sub(r"[\s\-\+\(\)]", "", login_input)
            if not re.match(r"^91\d{10}$", login_input):
                raise HTTPException(status_code=400, detail="Phone number must start with 91 followed by 10 digits (e.g. 919876543210).")

        # A. Query admins
        admin_res = execute_query(
            "SELECT * FROM admins WHERE email = %s OR phone = %s",
            (login_input, login_input)
        )
        if admin_res:
            matched_user = admin_res[0]
            role = "admin"
            profile_details = {"name": matched_user.get("name", "System Admin")}

        # B. Query hotels
        if not matched_user:
            hotel_res = execute_query(
                "SELECT * FROM hotels WHERE email = %s OR phone = %s",
                (login_input, login_input)
            )
            if hotel_res:
                matched_user = hotel_res[0]
                role = "recruiter"
                profile_details = {
                    "company": matched_user["company_name"],
                    "location": matched_user["location"],
                    "description": matched_user.get("description"),
                    "avatar": matched_user.get("avatar")
                }

        # C. Query students
        if not matched_user:
            student_res = execute_query(
                "SELECT * FROM students WHERE email = %s OR phone = %s",
                (login_input, login_input)
            )
            if student_res:
                matched_user = student_res[0]
                role = "student"
                profile_details = {
                    "name": matched_user["name"],
                    "bio": matched_user.get("bio"),
                    "languages": matched_user.get("languages"),
                    "education": matched_user.get("education"),
                    "eduGradYear": matched_user.get("edu_grad_year"),
                    "skills": matched_user.get("skills", []),
                    "internships": matched_user.get("internships", []),
                    "certificates": matched_user.get("certificates", []),
                    "resumeName": matched_user.get("resume_name"),
                    "school": matched_user.get("school"),
                    "startYear": matched_user.get("start_year"),
                    "endYear": matched_user.get("end_year"),
                    "jobTitle": matched_user.get("job_title"),
                    "location": matched_user.get("location"),
                    "avatar": matched_user.get("avatar")
                }

        if not matched_user:
            raise HTTPException(status_code=400, detail="Invalid credentials.")

        # Check password hash
        if not bcrypt.verify(req.password, matched_user["password_hash"]):
            raise HTTPException(status_code=400, detail="Invalid credentials.")

        # --- Login does NOT require OTP — return token directly ---
        user_id = matched_user["id"]
        token = create_access_token(user_id, role)

        return {
            "token": token,
            "user": {
                "id": user_id,
                "email": matched_user["email"],
                "phone": matched_user.get("phone"),
                "role": role,
                **profile_details
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print("Login server error:", e)
        raise HTTPException(status_code=500, detail="Server error during authentication.")


# 3. VERIFY OTP — Step 2: Validate OTP, return full auth token
@router.post("/verify-otp")
def verify_otp(req: OTPVerifyRequest):
    # Decode the short-lived OTP session token
    payload = decode_otp_token(req.otp_token)
    user_email = payload.get("otp_email")
    role = payload.get("otp_role")

    if not user_email or not role:
        raise HTTPException(status_code=400, detail="Invalid OTP session token.")

    try:
        # Find a valid, unused OTP for this email
        now = datetime.datetime.now(datetime.timezone.utc)
        otp_rows = execute_query(
            """SELECT * FROM otp_codes
               WHERE user_email = %s AND used = FALSE AND expires_at > %s
               ORDER BY created_at DESC LIMIT 1""",
            (user_email, now)
        )

        if not otp_rows:
            raise HTTPException(status_code=400, detail="OTP has expired or was not found. Please log in again.")

        otp_row = otp_rows[0]

        if otp_row["otp_code"] != req.otp_code.strip():
            raise HTTPException(status_code=400, detail="Incorrect OTP code. Please try again.")

        # Mark OTP as used
        execute_query(
            "UPDATE otp_codes SET used = TRUE WHERE id = %s",
            (otp_row["id"],),
            commit=True,
            fetch=False
        )

        # Now fetch the user's full profile to return
        profile_details = {}
        user_id = None

        if role == "admin":
            res = execute_query("SELECT * FROM admins WHERE email = %s", (user_email,))
            if res:
                row = res[0]
                user_id = row["id"]
                profile_details = {"name": row.get("name", "System Admin")}

        elif role == "recruiter":
            res = execute_query("SELECT * FROM hotels WHERE email = %s", (user_email,))
            if res:
                row = res[0]
                user_id = row["id"]
                profile_details = {
                    "company": row["company_name"],
                    "location": row["location"],
                    "description": row.get("description")
                }

        elif role == "student":
            res = execute_query("SELECT * FROM students WHERE email = %s", (user_email,))
            if res:
                row = res[0]
                user_id = row["id"]
                profile_details = {
                    "name": row["name"],
                    "bio": row.get("bio"),
                    "languages": row.get("languages"),
                    "education": row.get("education"),
                    "eduGradYear": row.get("edu_grad_year"),
                    "skills": row.get("skills", []),
                    "internships": row.get("internships", []),
                    "certificates": row.get("certificates", []),
                    "resumeName": row.get("resume_name")
                }

        if not user_id:
            raise HTTPException(status_code=404, detail="User not found.")

        # Generate full auth token
        token = create_access_token(user_id, role)

        return {
            "token": token,
            "user": {
                "id": user_id,
                "email": user_email,
                "phone": row.get("phone"),
                "role": role,
                **profile_details
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print("OTP verify error:", e)
        raise HTTPException(status_code=500, detail="Server error verifying OTP.")


# 4. GET SESSION PROFILE
@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user["role"]

    try:
        profile_details = {}
        email = None
        phone = None

        if role == "admin":
            res = execute_query("SELECT email, phone, name FROM admins WHERE id = %s", (user_id,))
            if not res:
                raise HTTPException(status_code=404, detail="Admin account not found.")
            row = res[0]
            email = row["email"]
            phone = row.get("phone")
            profile_details = {"name": row["name"]}

        elif role == "recruiter":
            res = execute_query("SELECT email, phone, company_name, location, description, avatar, interests FROM hotels WHERE id = %s", (user_id,))
            if not res:
                raise HTTPException(status_code=404, detail="Hotel profile not found.")
            row = res[0]
            email = row["email"]
            phone = row.get("phone")
            profile_details = {
                "company": row["company_name"],
                "location": row["location"],
                "description": row.get("description"),
                "avatar": row.get("avatar"),
                "interests": row.get("interests")
            }

        elif role == "student":
            res = execute_query("SELECT * FROM students WHERE id = %s", (user_id,))
            if not res:
                raise HTTPException(status_code=404, detail="Student profile not found.")
            row = res[0]
            email = row["email"]
            phone = row.get("phone")
            profile_details = {
                "name": row["name"],
                "bio": row.get("bio"),
                "languages": row.get("languages"),
                "education": row.get("education"),
                "eduGradYear": row.get("edu_grad_year"),
                "skills": row.get("skills", []),
                "internships": row.get("internships", []),
                "certificates": row.get("certificates", []),
                "resumeName": row.get("resume_name"),
                "school": row.get("school"),
                "startYear": row.get("start_year"),
                "endYear": row.get("end_year"),
                "jobTitle": row.get("job_title"),
                "location": row.get("location"),
                "avatar": row.get("avatar"),
                "interests": row.get("interests")
            }

        return {
            "id": user_id,
            "role": role,
            "email": email,
            "phone": phone,
            **profile_details
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Profile fetch error:", e)
        raise HTTPException(status_code=500, detail="Server error fetching profile details.")


# 5. UPDATE PROFILE
@router.put("/profile")
def update_profile(req: ProfileUpdateRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user["role"]

    try:
        if role == "student":
            existing = execute_query("SELECT * FROM students WHERE id = %s", (user_id,))
            if not existing:
                raise HTTPException(status_code=404, detail="Student not found.")
            row = existing[0]

            name = req.name if req.name is not None else row["name"]
            bio = req.bio if req.bio is not None else row.get("bio")
            languages = req.languages if req.languages is not None else row.get("languages")
            education = req.education if req.education is not None else row.get("education")
            edu_grad_year = req.eduGradYear if req.eduGradYear is not None else row.get("edu_grad_year")
            skills = req.skills if req.skills is not None else row.get("skills", [])
            import json
            internships = json.dumps(req.internships) if req.internships is not None else json.dumps(row.get("internships", []))
            certificates = req.certificates if req.certificates is not None else row.get("certificates", [])
            resume_name = req.resumeName if req.resumeName is not None else row.get("resume_name")
            school = req.school if req.school is not None else row.get("school")
            start_year = req.startYear if req.startYear is not None else row.get("start_year")
            end_year = req.endYear if req.endYear is not None else row.get("end_year")
            job_title = req.jobTitle if req.jobTitle is not None else row.get("job_title")
            location = req.location if req.location is not None else row.get("location")
            avatar = req.avatar if req.avatar is not None else row.get("avatar")
            interests = req.interests if req.interests is not None else row.get("interests")

            execute_query(
                """UPDATE students 
                   SET name = %s, bio = %s, languages = %s, education = %s, 
                       edu_grad_year = %s, skills = %s, internships = %s, 
                       certificates = %s, resume_name = %s, school = %s,
                       start_year = %s, end_year = %s, job_title = %s, location = %s, avatar = %s, interests = %s
                   WHERE id = %s""",
                (name, bio, languages, education, edu_grad_year, skills, internships, certificates, resume_name, school, start_year, end_year, job_title, location, avatar, interests, user_id),
                commit=True,
                fetch=False
            )

        elif role == "recruiter":
            existing = execute_query("SELECT * FROM hotels WHERE id = %s", (user_id,))
            if not existing:
                raise HTTPException(status_code=404, detail="Hotel not found.")
            row = existing[0]

            company = req.company if req.company is not None else row["company_name"]
            location = req.location if req.location is not None else row["location"]
            description = req.description if req.description is not None else row.get("description")
            avatar = req.avatar if req.avatar is not None else row.get("avatar")
            interests = req.interests if req.interests is not None else row.get("interests")

            execute_query(
                """UPDATE hotels 
                   SET company_name = %s, location = %s, description = %s, avatar = %s, interests = %s 
                   WHERE id = %s""",
                (company, location, description, avatar, interests, user_id),
                commit=True,
                fetch=False
            )
        else:
            raise HTTPException(status_code=400, detail="Profile updates are restricted for this role.")

        return {"message": "Profile updated successfully."}
    except HTTPException:
        raise
    except Exception as e:
        print("Profile update error:", e)
        raise HTTPException(status_code=500, detail="Server error updating profile details.")
