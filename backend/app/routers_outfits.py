from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from . import models, schemas, auth, database
from typing import Optional

router = APIRouter(prefix="/outfits", tags=["outfits"])

# Получить все аутфиты (с фильтрацией по категории и пагинацией)
@router.get("/", response_model=dict)
def get_outfits(
    category_id: Optional[int] = Query(None),
    limit: int = Query(12, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Outfit)
    if category_id:
        query = query.filter(models.Outfit.category_id == category_id)
    total = query.count()
    items = query.offset(offset).limit(limit).all()
    return {
        "total": total,
        "items": [schemas.Outfit.model_validate(item) for item in items]
    }

# Получить аутфит по id
@router.get("/{outfit_id}", response_model=schemas.Outfit)
def get_outfit(outfit_id: int, db: Session = Depends(database.get_db)):
    outfit = db.query(models.Outfit).filter(models.Outfit.id == outfit_id).first()
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return outfit

# Создать аутфит (только администратор)
@router.post("/", response_model=schemas.Outfit)
def create_outfit(outfit: schemas.OutfitBase, db: Session = Depends(database.get_db), user=Depends(auth.get_current_user)):
    # Проверяем, является ли пользователь администратором
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Only administrators can create outfits")
    
    items = []
    for item_data in outfit.items:
        item = models.Item(name=item_data.name, brand=item_data.brand, model=item_data.model)
        db.add(item)
        items.append(item)
    db.flush()  # чтобы у items появились id
    new_outfit = models.Outfit(
        title=outfit.title,
        description=outfit.description,
        image_url=outfit.image_url,
        category_id=outfit.category_id,
        items=items
    )
    db.add(new_outfit)
    db.commit()
    db.refresh(new_outfit)
    return new_outfit

# Обновить аутфит (только администратор)
@router.put("/{outfit_id}", response_model=schemas.Outfit)
def update_outfit(outfit_id: int, outfit: schemas.OutfitBase, db: Session = Depends(database.get_db), user=Depends(auth.get_current_user)):
    # Проверяем, является ли пользователь администратором
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Only administrators can update outfits")
    
    db_outfit = db.query(models.Outfit).filter(models.Outfit.id == outfit_id).first()
    if not db_outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    # Обновляем поля аутфита
    db_outfit.title = outfit.title # type: ignore
    db_outfit.description = outfit.description # type: ignore
    db_outfit.image_url = outfit.image_url # type: ignore
    db_outfit.category_id = outfit.category_id # type: ignore
    # Заменяем список вещей
    db_outfit.items.clear()
    for item_data in outfit.items:
        item = models.Item(name=item_data.name, brand=item_data.brand, model=item_data.model)
        db.add(item)
        db_outfit.items.append(item)
    db.commit()
    db.refresh(db_outfit)
    return db_outfit

# Удалить аутфит (только администратор)
@router.delete("/{outfit_id}")
def delete_outfit(outfit_id: int, db: Session = Depends(database.get_db), user=Depends(auth.get_current_user)):
    # Проверяем, является ли пользователь администратором
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Only administrators can delete outfits")
    
    db_outfit = db.query(models.Outfit).filter(models.Outfit.id == outfit_id).first()
    if not db_outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    db.delete(db_outfit)
    db.commit()
    return {"detail": "Outfit deleted"} 