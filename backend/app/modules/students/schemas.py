from typing import Optional

from pydantic import BaseModel, Field


class StudentCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str
    class_name: str
    guardian_name: str
    phone: str


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    class_name: Optional[str] = None
    guardian_name: Optional[str] = None
    phone: Optional[str] = None


class StudentOut(StudentCreate):
    id: str
