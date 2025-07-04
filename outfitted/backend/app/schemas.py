from pydantic import BaseModel, EmailStr
from typing import List, Optional

class ItemBase(BaseModel):
    name: str
    brand: Optional[str] = None
    model: Optional[str] = None

class Item(ItemBase):
    id: int
    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class OutfitBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category_id: int
    items: List[ItemBase] = []

class Outfit(OutfitBase):
    id: int
    items: List[Item] = []
    category: Category
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    favorites: List[Outfit] = []
    class Config:
        from_attributes = True 