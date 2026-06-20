import uvicorn
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.jobs import router as jobs_router
from routes.admin import router as admin_router

app = FastAPI(
    title="HospiHire API Portal",
    description="FastAPI + PostgreSQL backend for hospitality recruitment",
    version="1.0.0"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow Vite client requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(admin_router)

# Health Check Route
@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    return {"status": "OK", "message": "HospiHire FastAPI server is active."}

if __name__ == "__main__":
    # Start uvicorn server on port 5000 matching the Vite proxy
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
