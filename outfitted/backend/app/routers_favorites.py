from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, auth, database

router = APIRouter(prefix="/favorites", tags=["favorites"])

# Получить избранные аутфиты текущего пользователя
@router.get("/", response_model=list[schemas.Outfit])
def get_favorites(user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user.favorites

# Добавить аутфит в избранное
@router.post("/{outfit_id}")
def add_favorite(outfit_id: int, user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    outfit = db.query(models.Outfit).filter(models.Outfit.id == outfit_id).first()
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    if outfit in db_user.favorites:
        raise HTTPException(status_code=400, detail="Outfit already in favorites")
    db_user.favorites.append(outfit)
    db.commit()
    return {"detail": "Added to favorites"}

# Удалить аутфит из избранного
@router.delete("/{outfit_id}")
def remove_favorite(outfit_id: int, user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    outfit = db.query(models.Outfit).filter(models.Outfit.id == outfit_id).first()
    if not outfit or outfit not in db_user.favorites:
        raise HTTPException(status_code=404, detail="Outfit not in favorites")
    db_user.favorites.remove(outfit)
    db.commit()
    return {"detail": "Removed from favorites"} 