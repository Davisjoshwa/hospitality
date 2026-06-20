from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import json
from db import execute_query
from middleware.auth import get_current_user

router = APIRouter(prefix="/api/jobs", tags=["Jobs Board"])

# --- PYDANTIC SCHEMAS ---

class PostJobRequest(BaseModel):
    title: str
    company: str
    logo: Optional[str] = 'H'
    logoBg: Optional[str] = 'bg-blue-800 text-white'
    location: str
    type: str
    experience: Optional[str] = 'Entry-level (0-1 year)'
    salary: Optional[str] = 'Negotiable'
    salaryMin: Optional[int] = 0
    salaryMax: Optional[int] = 0
    category: str
    description: str
    requirements: Optional[List[str]] = []

class ApplyJobRequest(BaseModel):
    jobId: int
    coverNote: Optional[str] = ''

class BookmarkJobRequest(BaseModel):
    jobId: int

# --- ENDPOINTS ---

# 1. GET ALL JOBS (Public)
@router.get("")
def get_all_jobs():
    try:
        rows = execute_query("SELECT * FROM jobs ORDER BY posted_at DESC")
        
        jobs = []
        for row in rows:
            jobs.append({
                "id": row["id"],
                "recruiterId": row["recruiter_id"],
                "title": row["title"],
                "company": row["company"],
                "logo": row["logo"],
                "logoBg": row["logo_bg"],
                "location": row["location"],
                "type": row["type"],
                "experience": row["experience"],
                "salary": row["salary"],
                "salaryMin": row["salary_min"],
                "salaryMax": row["salary_max"],
                "category": row["category"],
                "description": row["description"],
                "requirements": row["requirements"],
                "postedAt": "Active"
            })
        return jobs
    except Exception as e:
        print("Error fetching jobs:", e)
        raise HTTPException(status_code=500, detail="Server error fetching job listings.")

# 2. POST A JOB (Recruiters/Hotels only)
@router.post("")
def post_job(req: PostJobRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "recruiter":
        raise HTTPException(status_code=403, detail="Only hotel recruiters can publish job vacancies.")
        
    recruiter_id = current_user["id"]
    
    try:
        res = execute_query(
            """INSERT INTO jobs (recruiter_id, title, company, logo, logo_bg, location, type, experience, salary, salary_min, salary_max, category, description, requirements) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
            (
                recruiter_id,
                req.title,
                req.company,
                req.logo,
                req.logoBg,
                req.location,
                req.type,
                req.experience,
                req.salary,
                req.salaryMin,
                req.salaryMax,
                req.category,
                req.description,
                req.requirements
            ),
            commit=True
        )
        
        row = res[0]
        return {
            "id": row["id"],
            "recruiterId": row["recruiter_id"],
            "title": row["title"],
            "company": row["company"],
            "logo": row["logo"],
            "logoBg": row["logo_bg"],
            "location": row["location"],
            "type": row["type"],
            "experience": row["experience"],
            "salary": row["salary"],
            "salaryMin": row["salary_min"],
            "salaryMax": row["salary_max"],
            "category": row["category"],
            "description": row["description"],
            "requirements": row["requirements"],
            "postedAt": "Just now"
        }
    except Exception as e:
        print("Error posting job:", e)
        raise HTTPException(status_code=500, detail="Server error publishing job vacancy.")

# 3. APPLY FOR A JOB (Students only)
@router.post("/apply")
def apply_job(req: ApplyJobRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only candidate students can apply for jobs.")
        
    student_id = current_user["id"]
    
    try:
        # Check if already applied
        app_check = execute_query(
            "SELECT id FROM applications WHERE student_id = %s AND job_id = %s",
            (student_id, req.jobId)
        )
        if app_check:
            raise HTTPException(status_code=400, detail="You have already applied for this vacancy.")

        execute_query(
            "INSERT INTO applications (job_id, student_id, cover_note) VALUES (%s, %s, %s)",
            (req.jobId, student_id, req.coverNote),
            commit=True,
            fetch=False
        )
        
        return {"message": "Application submitted successfully."}
    except HTTPException:
        raise
    except Exception as e:
        print("Error applying for job:", e)
        raise HTTPException(status_code=500, detail="Server error submitting application.")

# 4. BOOKMARK / SAVE JOB (Students only)
@router.post("/bookmark")
def toggle_bookmark(req: BookmarkJobRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only candidate students can bookmark jobs.")
        
    student_id = current_user["id"]
    
    try:
        bookmark_check = execute_query(
            "SELECT id FROM job_bookmarks WHERE student_id = %s AND job_id = %s",
            (student_id, req.jobId)
        )
        
        if bookmark_check:
            # Delete bookmark
            execute_query(
                "DELETE FROM job_bookmarks WHERE student_id = %s AND job_id = %s",
                (student_id, req.jobId),
                commit=True,
                fetch=False
            )
            return {"saved": False, "message": "Job unsaved successfully."}
        else:
            # Add bookmark
            execute_query(
                "INSERT INTO job_bookmarks (student_id, job_id) VALUES (%s, %s)",
                (student_id, req.jobId),
                commit=True,
                fetch=False
            )
            return {"saved": True, "message": "Job saved successfully."}
    except Exception as e:
        print("Error toggling bookmark:", e)
        raise HTTPException(status_code=500, detail="Server error updating bookmarked jobs.")

# 5. GET STUDENT DASHBOARD DATA (Applied & Saved jobs list)
@router.get("/student-data")
def get_student_data(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can access student dashboard metrics.")
        
    student_id = current_user["id"]
    
    try:
        apps_res = execute_query("SELECT job_id FROM applications WHERE student_id = %s", (student_id,))
        applied_ids = [r["job_id"] for r in apps_res]
        
        bookmarks_res = execute_query("SELECT job_id FROM job_bookmarks WHERE student_id = %s", (student_id,))
        saved_ids = [r["job_id"] for r in bookmarks_res]
        
        return {
            "appliedJobs": applied_ids,
            "savedJobs": saved_ids
        }
    except Exception as e:
        print("Error fetching student data:", e)
        raise HTTPException(status_code=500, detail="Server error fetching student data.")

# 6. GET RECRUITER APPLICANTS LIST (Recruiters/Hotels only)
@router.get("/recruiter-applicants")
def get_recruiter_applicants(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "recruiter":
        raise HTTPException(status_code=403, detail="Only hotel recruiters can audit applicants.")
        
    recruiter_id = current_user["id"]
    
    try:
        applicants_res = execute_query(
            """SELECT 
                a.id as application_id,
                a.status,
                a.applied_at,
                j.id as job_id,
                j.title as job_title,
                s.name as candidate_name,
                s.email as candidate_email,
                s.education as candidate_education,
                s.skills as candidate_skills,
                s.internships as candidate_internships,
                s.certificates as candidate_certificates,
                s.resume_name as candidate_resume
               FROM applications a
               JOIN jobs j ON a.job_id = j.id
               JOIN students s ON a.student_id = s.id
               WHERE j.recruiter_id = %s
               ORDER BY a.applied_at DESC""",
            (recruiter_id,)
        )
        
        applicants = []
        for row in applicants_res:
            # Parse candidate internships from JSONB
            internships = row["candidate_internships"]
            if isinstance(internships, str):
                internships = json.loads(internships)
                
            applicants.append({
                "id": row["application_id"],
                "jobId": row["job_id"],
                "jobTitle": row["job_title"],
                "candidateName": row["candidate_name"],
                "candidateEmail": row["candidate_email"],
                "candidateEducation": row.get("candidate_education"),
                "candidateSkills": row.get("candidate_skills", []),
                "candidateInternships": internships,
                "candidateCertificates": row.get("candidate_certificates", []),
                "candidateResume": row.get("candidate_resume"),
                "status": row["status"],
                "appliedAt": row["applied_at"]
            })
            
        return applicants
    except Exception as e:
        print("Error fetching recruiter applicants:", e)
        raise HTTPException(status_code=500, detail="Server error fetching applicants list.")
