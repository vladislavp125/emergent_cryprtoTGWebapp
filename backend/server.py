from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from datetime import datetime, timedelta
import uuid
import random
from typing import List, Optional

# Импортируем модули приложения
from database import get_db, engine
from models import Base, User, Server, Transaction, Trade, Task, UserTask
import schemas
import models

# Создаем экземпляр FastAPI
app = FastAPI(title="EVA AI Trade Bot API")

# Настраиваем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем все таблицы базы данных при запуске (если их еще нет)
models.Base.metadata.create_all(bind=engine)

# API маршруты

@app.get("/")
def read_root():
    return {"message": "EVA AI Trade Bot API"}

# User API

@app.get("/api/user/{user_id}", response_model=schemas.User)
def get_user(user_id: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/api/user/{user_id}/details", response_model=schemas.UserWithDetails)
def get_user_details(user_id: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/api/user/current", response_model=schemas.User)
def get_current_user(db: Session = Depends(get_db)):
    # В будущем здесь будет проверка аутентификации через Telegram
    # Пока возвращаем тестового пользователя
    db_user = db.query(models.User).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="No users in database")
    return db_user

# Stats API

@app.get("/api/stats", response_model=schemas.StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    # Получаем текущего пользователя
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Получаем количество активных серверов
    active_servers = db.query(models.Server).filter(
        models.Server.user_id == user.id, 
        models.Server.is_active == True
    ).count()
    
    # Создаем ответ с статистикой
    return {
        "total_earnings": user.total_earnings,
        "server_earnings": user.server_earnings,
        "referral_earnings": user.referral_earnings,
        "active_servers": active_servers,
        "profitability": 87,  # Фиксированные значения для демонстрации
        "success_rate": 92,
        "server_capacity": 60
    }

# Servers API

@app.get("/api/servers", response_model=List[schemas.Server])
def get_servers(db: Session = Depends(get_db)):
    user = db.query(models.User).first()  # Текущий пользователь
    servers = db.query(models.Server).filter(models.Server.user_id == user.id).all()
    return servers

@app.post("/api/servers/rent", response_model=schemas.Server)
def rent_server(request: schemas.RentServerRequest, db: Session = Depends(get_db)):
    server = db.query(models.Server).filter(models.Server.id == request.server_id).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    if server.is_active:
        raise HTTPException(status_code=400, detail="Server is already active")
    
    # Активируем сервер
    server.is_active = True
    db.commit()
    db.refresh(server)
    
    return server

# Trades API

@app.get("/api/trades", response_model=List[schemas.Trade])
def get_trades(limit: int = 10, db: Session = Depends(get_db)):
    trades = db.query(models.Trade).order_by(models.Trade.timestamp.desc()).limit(limit).all()
    return trades

@app.get("/api/trades/live", response_model=schemas.Trade)
def get_live_trade(db: Session = Depends(get_db)):
    # Здесь мы просто создаем новую случайную сделку для симуляции
    pairs = ["BTC/USDT", "ETH/USDT", "TON/USDT", "SOL/USDT", "ADA/USDT"]
    pair = random.choice(pairs)
    
    # Генерируем случайные цены
    base_price = random.uniform(100, 50000) if pair != "TON/USDT" else random.uniform(3, 7)
    profit_percentage = random.uniform(0.5, 4.5)
    entry_price = base_price
    exit_price = base_price * (1 + profit_percentage / 100)
    
    # Создаем объект сделки
    trade = models.Trade(
        id=str(uuid.uuid4()),
        pair=pair,
        entry_price=entry_price,
        exit_price=exit_price,
        profit_percentage=profit_percentage,
        timestamp=datetime.now() - timedelta(seconds=random.randint(5, 60))
    )
    
    # Сохраняем в базу данных
    db.add(trade)
    db.commit()
    db.refresh(trade)
    
    return trade

# Transactions API

@app.get("/api/transactions", response_model=List[schemas.Transaction])
def get_transactions(transaction_type: Optional[str] = None, db: Session = Depends(get_db)):
    user = db.query(models.User).first()  # Текущий пользователь
    
    query = db.query(models.Transaction).filter(models.Transaction.user_id == user.id)
    if transaction_type:
        query = query.filter(models.Transaction.type == transaction_type)
    
    transactions = query.order_by(models.Transaction.timestamp.desc()).all()
    return transactions

@app.post("/api/transactions/withdraw", response_model=schemas.Transaction)
def withdraw(request: schemas.WithdrawRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).first()  # Текущий пользователь
    
    if user.available_balance < request.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Создаем транзакцию
    transaction = models.Transaction(
        id=str(uuid.uuid4()),
        type="withdrawal",
        amount=request.amount,
        currency=request.currency,
        wallet=request.wallet_address,
        hash=f"0x{uuid.uuid4().hex[:8]}...{uuid.uuid4().hex[:4]}",
        user_id=user.id
    )
    
    # Обновляем баланс пользователя
    user.available_balance -= request.amount
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    return transaction

# Tasks API

@app.get("/api/tasks", response_model=List[schemas.UserTask])
def get_tasks(task_type: Optional[str] = None, db: Session = Depends(get_db)):
    user = db.query(models.User).first()  # Текущий пользователь
    
    query = db.query(models.UserTask).join(models.Task).filter(models.UserTask.user_id == user.id)
    if task_type:
        query = query.filter(models.Task.type == task_type)
    
    user_tasks = query.all()
    return user_tasks

@app.post("/api/tasks/{task_id}/claim")
def claim_task(task_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).first()  # Текущий пользователь
    
    user_task = db.query(models.UserTask).filter(
        models.UserTask.user_id == user.id,
        models.UserTask.task_id == task_id
    ).first()
    
    if not user_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if not user_task.is_completed:
        raise HTTPException(status_code=400, detail="Task is not completed yet")
    
    if user_task.is_claimed:
        raise HTTPException(status_code=400, detail="Reward already claimed")
    
    # Получаем информацию о задании
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    # Начисляем награду
    user.available_balance += task.reward
    user.total_earnings += task.reward
    
    # Помечаем как полученное
    user_task.is_claimed = True
    
    db.commit()
    
    return {"success": True, "reward": task.reward}

# Referrals API

@app.get("/api/referrals/stats", response_model=schemas.ReferralStats)
def get_referral_stats(db: Session = Depends(get_db)):
    user = db.query(models.User).first()  # Текущий пользователь
    
    # В реальном приложении здесь будет код для получения статистики рефералов
    # Для демонстрации используем тестовые данные
    return {
        "total_referrals": 24,
        "total_earned": user.referral_earnings,
        "level_1_referrals": 12,
        "level_2_referrals": 12,
        "referral_link": f"https://t.me/evatradebot?start=ref{uuid.uuid4().hex[:8]}"
    }

# Запускаем БД и добавляем тестовые данные при первом запуске
@app.on_event("startup")
def startup_db_client():
    try:
        db = next(get_db())
        user_count = db.query(models.User).count()
        
        if user_count == 0:
            from setup_db import create_mock_data
            create_mock_data()
            print("Database initialized with mock data")
    except Exception as e:
        print(f"Error initializing database: {e}")
