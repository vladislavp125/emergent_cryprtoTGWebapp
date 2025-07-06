from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Table, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime
import uuid

Base = declarative_base()

# Связующая таблица для отношения многие-ко-многим между пользователями (для рефералов)
referrals_association = Table(
    "referrals_association",
    Base.metadata,
    Column("referrer_id", String, ForeignKey("users.id")),
    Column("referred_id", String, ForeignKey("users.id"))
)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    total_earnings = Column(Float, default=0.0)
    server_earnings = Column(Float, default=0.0)
    referral_earnings = Column(Float, default=0.0)
    available_balance = Column(Float, default=0.0)
    wallet_address = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

    # Отношения
    servers = relationship("Server", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")

    # Рефералы (многие-ко-многим)
    referrals = relationship(
        "User",
        secondary=referrals_association,
        primaryjoin=id==referrals_association.c.referrer_id,
        secondaryjoin=id==referrals_association.c.referred_id,
        backref="referrers"
    )

    # Задания пользователя
    tasks = relationship("UserTask", back_populates="user")


class Server(Base):
    __tablename__ = "servers"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100))
    is_active = Column(Boolean, default=False)
    cpu_cores = Column(Integer)
    ram_gb = Column(Integer)
    ghz = Column(Integer)
    daily_profit = Column(Float)
    rental_cost = Column(Float)
    user_id = Column(String, ForeignKey("users.id"))
    
    # Отношения
    user = relationship("User", back_populates="servers")


class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String(20))  # "withdrawal" или "deposit"
    amount = Column(Float)
    currency = Column(String(10))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    wallet = Column(String(255))
    hash = Column(String(255))
    user_id = Column(String, ForeignKey("users.id"))
    
    # Отношения
    user = relationship("User", back_populates="transactions")


class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    pair = Column(String(20))  # Например "BTC/USDT"
    entry_price = Column(Float)
    exit_price = Column(Float)
    profit_percentage = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100))
    description = Column(Text)
    reward = Column(Float)
    type = Column(String(20))  # "general" или "referral"
    total_steps = Column(Integer, default=1)


class UserTask(Base):
    __tablename__ = "user_tasks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    task_id = Column(String, ForeignKey("tasks.id"))
    progress = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    is_claimed = Column(Boolean, default=False)
    
    # Отношения
    user = relationship("User", back_populates="tasks")
    task = relationship("Task")
