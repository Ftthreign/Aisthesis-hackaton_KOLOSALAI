"""
Custom exceptions for Gemini prompt operations.
"""


class GeminiError(Exception):
    """Base exception for Gemini-related errors."""

    def __init__(self, message: str, original_error: Exception | None = None):
        self.message = message
        self.original_error = original_error
        super().__init__(self.message)


class GeminiAPIError(GeminiError):
    """Raised when Gemini API call fails."""

    pass


class GeminiValidationError(GeminiError):
    """Raised when Gemini response fails validation."""

    pass


class GeminiRateLimitError(GeminiError):
    """Raised when Gemini API rate limit is exceeded."""

    pass
