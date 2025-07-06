from sqlalchemy import Column, Integer, String, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from .database import Base

# Связующая таблица для вещей в аутфите
outfit_items = Table(
    'outfit_items', Base.metadata,
    Column('outfit_id', Integer, ForeignKey('outfits.id')),
    Column('item_id', Integer, ForeignKey('items.id'))
)

# Избранные аутфиты пользователя
favorites = Table(
    'favorites', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('outfit_id', Integer, ForeignKey('outfits.id'))
)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    favorites = relationship('Outfit', secondary=favorites, back_populates='liked_by')

class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    outfits = relationship('Outfit', back_populates='category')

class Outfit(Base):
    __tablename__ = 'outfits'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    image_url = Column(String)
    category_id = Column(Integer, ForeignKey('categories.id'))
    category = relationship('Category', back_populates='outfits')
    items = relationship('Item', secondary=outfit_items, back_populates='outfits')
    liked_by = relationship('User', secondary=favorites, back_populates='favorites')

class Item(Base):
    __tablename__ = 'items'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String)
    model = Column(String)
    outfits = relationship('Outfit', secondary=outfit_items, back_populates='items') 