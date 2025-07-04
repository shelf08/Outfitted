from fastapi import FastAPI
from .database import Base, engine
from . import models
from .routers_users import router as users_router
from .routers_categories import router as categories_router
from .routers_outfits import router as outfits_router
from .routers_favorites import router as favorites_router

app = FastAPI(title="Outfitted")

# Автоматическое создание таблиц при запуске

Base.metadata.create_all(bind=engine)
app.include_router(users_router)
app.include_router(categories_router)
app.include_router(outfits_router)
app.include_router(favorites_router)

@app.get("/")
def read_root():
    return {"message": "Outfitted API"} 