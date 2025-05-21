from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

# Создаем движок SQLAlchemy
engine = create_engine(DATABASE_URL)

# Создаем объект сессии
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Функция для получения зависимости БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
