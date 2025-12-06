from pydantic import BaseModel, EmailStr

from . import DataResponse


class GoogleTokenPayload(BaseModel):
    sub: str
    email: str
    name: str | None = None
    picture: str | None = None


class GoogleAuthRequest(BaseModel):
    id_token: str


class TokenData(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenResponse(DataResponse[TokenData]):
    """Wrapped token response."""
    pass
