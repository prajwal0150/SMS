from fastapi import APIRouter

from app.modules.auth.routes import router as auth_router
from app.modules.students.routes import router as students_router

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(students_router, prefix="/students", tags=["students"])
