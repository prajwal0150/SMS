from typing import Any

from app.database.mongodb import get_collection

students_collection = get_collection("students")


class StudentRepository:
    @staticmethod
    def list_students() -> list[dict[str, Any]]:
        return list(students_collection.find({}))

    @staticmethod
    def create_student(data: dict[str, Any]) -> dict[str, Any]:
        result = students_collection.insert_one(data)
        return {"id": str(result.inserted_id), **data}

    @staticmethod
    def get_student(student_id: str) -> dict[str, Any] | None:
        return students_collection.find_one({"_id": student_id})

    @staticmethod
    def delete_student(student_id: str) -> bool:
        result = students_collection.delete_one({"_id": student_id})
        return result.deleted_count > 0
