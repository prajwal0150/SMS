from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.modules.students.schemas import StudentCreate, StudentOut, StudentUpdate
from app.modules.students.service import StudentService

router = APIRouter()


@router.get("/", response_model=list[dict[str, Any]])
def get_students() -> list[dict[str, Any]]:
    return StudentService.list_students()


@router.post("/", response_model=dict[str, Any], status_code=status.HTTP_201_CREATED)
def create_student(payload: StudentCreate) -> dict[str, Any]:
    return StudentService.create_student(payload.model_dump())


@router.get("/{student_id}", response_model=dict[str, Any] | None)
def get_student(student_id: str) -> dict[str, Any] | None:
    student = StudentService.get_student(student_id)
    if student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: str) -> None:
    deleted = StudentService.delete_student(student_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
