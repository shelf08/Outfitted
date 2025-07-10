from sqlalchemy.orm import Session
from . import models, database, auth

def create_admin_user():
    db = next(database.get_db())
    
    # Проверяем, существует ли уже пользователь shelf
    existing_user = db.query(models.User).filter(models.User.username == "shelf").first()
    
    if existing_user:
        print("Пользователь shelf уже существует")
        return
    
    # Создаем хэш пароля
    hashed_password = auth.get_password_hash("shelf")
    
    # Создаем пользователя-администратора
    admin_user = models.User(
        username="shelf",
        email="shelf@outfitted.ru",
        hashed_password=hashed_password,
        is_admin=True
    )
    
    db.add(admin_user)
    db.commit()
    print("Администратор shelf создан успешно")

if __name__ == "__main__":
    create_admin_user() 