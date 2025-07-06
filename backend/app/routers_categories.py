from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import models, schemas, auth, database

router = APIRouter(prefix="/categories", tags=["categories"])

# Получить все категории
@router.get("/", response_model=list[schemas.Category])
def get_categories(db: Session = Depends(database.get_db)):
    return db.query(models.Category).all()

# Получить категорию по id
@router.get("/{category_id}", response_model=schemas.Category)
def get_category(category_id: int, db: Session = Depends(database.get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# Создать категорию (только авторизованный)
@router.post("/", response_model=schemas.Category)
def create_category(category: schemas.CategoryBase, db: Session = Depends(database.get_db), user=Depends(auth.get_current_user)):
    db_category = db.query(models.Category).filter(models.Category.name == category.name).first()
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists")
    new_category = models.Category(name=category.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

# Обновить категорию (только авторизованный)
@router.put("/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, category: schemas.CategoryBase, db: Session = Depends(database.get_db), user=Depends(auth.get_current_user)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db_category.name = category.name # type: ignore
    db.commit()
    db.refresh(db_category)
    return db_category

# Удалить категорию (только авторизованный)
@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(database.get_db), user=Depends(auth.get_current_user)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return {"detail": "Category deleted"} 