from typing import Any

from app.modules.students.repository import StudentRepository


class StudentService:
    @staticmethod
    def list_students() -> list[dict[str, Any]]:
        return StudentRepository.list_students()

    @staticmethod
    def create_student(payload: dict[str, Any]) -> dict[str, Any]:
        return StudentRepository.create_student(payload)

    @staticmethod
    def get_student(student_id: str) -> dict[str, Any] | None:
        return StudentRepository.get_student(student_id)

    @staticmethod
    def delete_student(student_id: str) -> bool:
        return StudentRepository.delete_student(student_id)
