from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime
import jwt
import os
from passlib.hash import bcrypt
from db import execute_query
from middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("JWT_SECRET") or "supersecretjwtkeyhospihire2026"

def create_access_token(user_id: int, role: str):
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    payload = {
        "id": user_id,
        "role": role,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# --- PYDANTIC SCHEMAS ---

class LoginRequest(BaseModel):
    emailOrPhone: str
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str # 'student' | 'recruiter'
    phone: Optional[str] = None
    name: Optional[str] = None # For students
    companyName: Optional[str] = None # For recruiters
    location: Optional[str] = None # For recruiters

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

# --- ENDPOINTS ---

# 1. REGISTER
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest):
    role = req.role
    if role not in ["student", "recruiter"]:
        raise HTTPException(status_code=400, detail="Invalid registration role.")
        
    if role == "student" and not req.name:
        raise HTTPException(status_code=400, detail="Full name is required for students.")
        
    if role == "recruiter" and (not req.companyName or not req.location):
        raise HTTPException(status_code=400, detail="Company name and location are required for hotel recruiters.")

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
            # Insert into students table
            res = execute_query(
                """INSERT INTO students (email, phone, password_hash, name) 
                   VALUES (%s, %s, %s, %s) RETURNING id""",
                (req.email, req.phone, password_hash, req.name),
                commit=True
            )
            user_id = res[0]["id"]
            profile_data = {"name": req.name}
        elif role == "recruiter":
            # Insert into hotels table
            res = execute_query(
                """INSERT INTO hotels (email, phone, password_hash, company_name, location, is_verified) 
                   VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
                (req.email, req.phone, password_hash, req.companyName, req.location, True),
                commit=True
            )
            user_id = res[0]["id"]
            profile_data = {"company": req.companyName, "location": req.location}

        token = create_access_token(user_id, role)
        
        return {
            "token": token,
            "user": {
                "id": user_id,
                "email": req.email,
                "role": role,
                **profile_data
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Registration server error:", e)
        raise HTTPException(status_code=500, detail="Server error during registration.")

# 2. LOGIN (Sequentially queries admins, hotels, then students)
@router.post("/login")
def login(req: LoginRequest):
    try:
        matched_user = None
        role = None
        profile_details = {}

        # A. Query admins
        admin_res = execute_query(
            "SELECT * FROM admins WHERE email = %s OR phone = %s",
            (req.emailOrPhone, req.emailOrPhone)
        )
        if admin_res:
            matched_user = admin_res[0]
            role = "admin"
            profile_details = {"name": matched_user.get("name", "System Admin")}

        # B. Query hotels
        if not matched_user:
            hotel_res = execute_query(
                "SELECT * FROM hotels WHERE email = %s OR phone = %s",
                (req.emailOrPhone, req.emailOrPhone)
            )
            if hotel_res:
                matched_user = hotel_res[0]
                role = "recruiter"
                profile_details = {
                    "company": matched_user["company_name"],
                    "location": matched_user["location"],
                    "description": matched_user.get("description")
                }

        # C. Query students
        if not matched_user:
            student_res = execute_query(
                "SELECT * FROM students WHERE email = %s OR phone = %s",
                (req.emailOrPhone, req.emailOrPhone)
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
                    "resumeName": matched_user.get("resume_name")
                }

        if not matched_user:
            raise HTTPException(status_code=400, detail="Invalid credentials.")

        # Check password hash
        if not bcrypt.verify(req.password, matched_user["password_hash"]):
            raise HTTPException(status_code=400, detail="Invalid credentials.")

        # Generate JWT
        token = create_access_token(matched_user["id"], role)

        return {
            "token": token,
            "user": {
                "id": matched_user["id"],
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

# 3. GET SESSION PROFILE
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
            res = execute_query("SELECT email, phone, company_name, location, description FROM hotels WHERE id = %s", (user_id,))
            if not res:
                raise HTTPException(status_code=404, detail="Hotel profile not found.")
            row = res[0]
            email = row["email"]
            phone = row.get("phone")
            profile_details = {
                "company": row["company_name"],
                "location": row["location"],
                "description": row.get("description")
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
                "resumeName": row.get("resume_name")
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

# 4. UPDATE PROFILE
@router.put("/profile")
def update_profile(req: ProfileUpdateRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user["role"]
    
    try:
        if role == "student":
            # Fetch existing profile row for default merges
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
            internships = json.dumps(req.internships) if req.internships is not None else json.dumps(row.get("internships", []))
            certificates = req.certificates if req.certificates is not None else row.get("certificates", [])
            resume_name = req.resumeName if req.resumeName is not None else row.get("resume_name")

            import json
            execute_query(
                """UPDATE students 
                   SET name = %s, bio = %s, languages = %s, education = %s, 
                       edu_grad_year = %s, skills = %s, internships = %s, 
                       certificates = %s, resume_name = %s 
                   WHERE id = %s""",
                (name, bio, languages, education, edu_grad_year, skills, internships, certificates, resume_name, user_id),
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

            execute_query(
                """UPDATE hotels 
                   SET company_name = %s, location = %s, description = %s 
                   WHERE id = %s""",
                (company, location, description, user_id),
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
