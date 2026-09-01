class AppException(Exception):
    """Base application exception."""


class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found"):
        self.message = message
        super().__init__(message)


class ValidationError(AppException):
    def __init__(self, message: str = "Validation failed"):
        self.message = message
        super().__init__(message)


class AuthenticationError(AppException):
    def __init__(self, message: str = "Authentication failed"):
        self.message = message
        super().__init__(message)
