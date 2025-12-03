from pydantic import BaseModel, EmailStr


class GoogleTokenPayload(BaseModel):
    sub: str
    email: str
    name: str | None = None
    picture: str | None = None


class GoogleAuthRequest(BaseModel):
    id_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
