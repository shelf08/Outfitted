from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from . import models
from .routers_users import router as users_router
from .routers_categories import router as categories_router
from .routers_outfits import router as outfits_router
from .routers_favorites import router as favorites_router
from .create_admin import create_admin_user

app = FastAPI(title="Outfitted")

# Добавь CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Создаем администратора при запуске
create_admin_user()

app.include_router(users_router)
app.include_router(categories_router)
app.include_router(outfits_router)
app.include_router(favorites_router)

@app.get("/")
def read_root():
    return {"message": "Outfitted API"} 