from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from . import models, schemas, auth, database
from typing import Optional
import os
from uuid import uuid4
import inspect
import re

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
def create_outfit(
    title: str = Form(...),
    description: str = Form(''),
    category_id: int = Form(...),
    image: UploadFile = File(...),
    # items как динамические поля формы
    db: Session = Depends(database.get_db),
    user=Depends(auth.get_current_user),
    # request: Request  # если понадобится
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Only administrators can create outfits")

    # Парсим items из формы вручную
    # Получаем сырые данные формы через image.file (или request.form() если понадобится)
    # Но FastAPI сам не парсит массивы из Form, поэтому используем starlette.datastructures.FormData
    from fastapi import Request
    from starlette.requests import Request as StarletteRequest
    import json
    # Получаем все поля формы через image.file (hack, т.к. request.form() тут не получить)
    # Поэтому items будем получать через отдельные поля
    # Для простоты: items[0][name], items[0][brand], items[0][model], ...
    # Получаем их из FastAPI FormData через request, но тут workaround: используем image.filename как триггер
    # Воспользуемся image.file для сохранения файла

    # Сохраняем файл
    images_dir = os.path.join(os.path.dirname(__file__), '../../frontend/public/images/outfits')
    images_dir = os.path.abspath(images_dir)
    os.makedirs(images_dir, exist_ok=True)
    ext = os.path.splitext(image.filename)[1]
    filename = f"{uuid4().hex}{ext}"
    file_path = os.path.join(images_dir, filename)
    with open(file_path, "wb") as f:
        f.write(image.file.read())
    image_url = f"/images/outfits/{filename}"

    # Парсим items из FormData (ищем все поля items[<idx>][name], ...)
    # FastAPI не даёт доступ к request.form() тут, workaround: используем глобальный request, но проще -
    # Получаем все поля из FormData через kwargs (locals()), фильтруем по items
    frame = inspect.currentframe()
    args, _, _, values = inspect.getargvalues(frame)
    items = []
    idx = 0
    while True:
        name = values.get(f'items[{idx}][name]')
        brand = values.get(f'items[{idx}][brand]')
        model = values.get(f'items[{idx}][model]')
        if name is None:
            break
        items.append(models.Item(name=name, brand=brand, model=model))
        idx += 1
    if not items:
        items = []
    for item in items:
        db.add(item)
    db.flush()
    new_outfit = models.Outfit(
        title=title,
        description=description,
        image_url=image_url,
        category_id=category_id,
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