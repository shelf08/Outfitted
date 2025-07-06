from .database import Base, engine
from . import models
 
print("Creating tables in DB:", engine.url)
Base.metadata.create_all(bind=engine)
print("Done!") 