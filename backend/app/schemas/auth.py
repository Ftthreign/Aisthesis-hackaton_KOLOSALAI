from pydantic import BaseModel


class GoogleTokenPayload(BaseModel):
    sub: str
    email: str
    name: str | None = None
    picture: str | None = None
