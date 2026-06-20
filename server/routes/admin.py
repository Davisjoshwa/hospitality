from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from db import execute_query
from middleware.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Platform Administration"])

# --- ADMIN GATEWAY DEPENDENCY ---
def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Administrative privileges required."
        )
    return current_user

# --- PYDANTIC SCHEMAS ---

class ToggleVerifyRequest(BaseModel):
    userId: int
    isVerified: bool

# --- ENDPOINTS (Protected under Admin gateway) ---

# 1. GET ALL PLATFORM USERS (UNION Query from students, hotels, and admins)
@router.get("/users")
def get_all_users(admin: dict = Depends(get_current_admin)):
    try:
        rows = execute_query(
            """SELECT id, email, phone, name, 'student' as role, TRUE as is_verified, created_at FROM students
               UNION ALL
               SELECT id, email, phone, company_name as name, 'recruiter' as role, is_verified, created_at FROM hotels
               UNION ALL
               SELECT id, email, phone, name, 'admin' as role, TRUE as is_verified, created_at FROM admins
               ORDER BY created_at DESC"""
        )
        
        users = []
        for row in rows:
            users.append({
                "id": row["id"],
                "email": row["email"],
                "phone": row.get("phone"),
                "role": row["role"],
                "isVerified": row["is_verified"],
                "createdAt": row["created_at"],
                "name": row["name"]
            })
            
        return users
    except Exception as e:
        print("Error fetching all users by admin:", e)
        raise HTTPException(status_code=500, detail="Server error retrieving platform registrations.")

# 2. TOGGLE RECRUITER VERIFICATION (Only hotels can be verified)
@router.put("/verify")
def toggle_recruiter_verify(req: ToggleVerifyRequest, admin: dict = Depends(get_current_admin)):
    try:
        # Check if hotel exists
        hotel = execute_query("SELECT id FROM hotels WHERE id = %s", (req.userId,))
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel recruiter account not found.")

        execute_query(
            "UPDATE hotels SET is_verified = %s WHERE id = %s",
            (req.isVerified, req.userId),
            commit=True,
            fetch=False
        )
        
        return {"message": f"Hotel verification status updated to {req.isVerified}."}
    except HTTPException:
        raise
    except Exception as e:
        print("Error toggling hotel verification by admin:", e)
        raise HTTPException(status_code=500, detail="Server error updating verification status.")

# 3. DELETE JOB POSTING
@router.delete("/jobs/{job_id}")
def delete_job_by_admin(job_id: int, admin: dict = Depends(get_current_admin)):
    try:
        job = execute_query("SELECT id FROM jobs WHERE id = %s", (job_id,))
        if not job:
            raise HTTPException(status_code=404, detail="Job vacancy not found.")
            
        execute_query("DELETE FROM jobs WHERE id = %s", (job_id,), commit=True, fetch=False)
        return {"message": "Job vacancy deleted successfully by admin."}
    except HTTPException:
        raise
    except Exception as e:
        print("Error auditing job deletion by admin:", e)
        raise HTTPException(status_code=500, detail="Server error deleting job listing.")

# 4. GET SYSTEM PLATFORM TELEMETRY STATS
@router.get("/stats")
def get_admin_stats(admin: dict = Depends(get_current_admin)):
    try:
        students_res = execute_query("SELECT COUNT(*) FROM students")
        hotels_res = execute_query("SELECT COUNT(*) FROM hotels")
        admins_res = execute_query("SELECT COUNT(*) FROM admins")
        jobs_res = execute_query("SELECT COUNT(*) FROM jobs")
        apps_res = execute_query("SELECT COUNT(*) FROM applications")

        total_students = int(students_res[0]["count"])
        total_hotels = int(hotels_res[0]["count"])
        total_admins = int(admins_res[0]["count"])
        total_jobs = int(jobs_res[0]["count"])
        total_applications = int(apps_res[0]["count"])

        return {
            "totalUsers": total_students + total_hotels + total_admins,
            "totalStudents": total_students,
            "totalRecruiters": total_hotels,
            "totalJobs": total_jobs,
            "totalApplications": total_applications
        }
    except Exception as e:
        print("Error fetching platform stats for admin:", e)
        raise HTTPException(status_code=500, detail="Server error gathering platform telemetry metrics.")
