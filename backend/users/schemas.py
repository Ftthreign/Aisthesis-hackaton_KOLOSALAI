from pydantic import BaseModel, EmailStr


# NestJS: CreateUserDto
class UserCreate(BaseModel):
    email: EmailStr
    password: str


# NestJS: UserResponseDto
class UserPublic(BaseModel):
    id: int
    email: EmailStr
