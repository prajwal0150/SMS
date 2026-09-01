from app.core.security import create_access_token


class AuthService:
    @staticmethod
    def login(email: str, password: str) -> str:
        if email == "admin@sms.local" and password == "admin123":
            return create_access_token(email)
        raise ValueError("Invalid credentials")
