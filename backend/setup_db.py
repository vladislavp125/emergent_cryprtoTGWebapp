from sqlalchemy import create_engine
from models import Base
from database import DATABASE_URL
import os
from dotenv import load_dotenv
import random
from datetime import datetime, timedelta
import uuid

# Импортируем модели
from models import User, Server, Transaction, Trade, Task, UserTask, Base

load_dotenv()

# Создаем движок SQLAlchemy
engine = create_engine(DATABASE_URL)

def create_tables():
    # Создаем все таблицы
    Base.metadata.create_all(bind=engine)
    print("Таблицы созданы успешно")

def create_mock_data():
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Создаем пользователя
        user = User(
            id=str(uuid.uuid4()),
            username="cryptotrader",
            total_earnings=1245.78,
            server_earnings=892.50,
            referral_earnings=353.28,
            available_balance=342.15,
            wallet_address="0x7f3...4d21"
        )
        db.add(user)
        db.flush()
        
        # Создаем 5 серверов для пользователя
        servers_data = [
            {
                "name": "BASIC NODE", 
                "is_active": True, 
                "cpu_cores": 2, 
                "ram_gb": 4, 
                "ghz": 50, 
                "daily_profit": 3.25, 
                "rental_cost": 0.50
            },
            {
                "name": "ADVANCED NODE", 
                "is_active": True, 
                "cpu_cores": 4, 
                "ram_gb": 8, 
                "ghz": 120, 
                "daily_profit": 7.80, 
                "rental_cost": 1.20
            },
            {
                "name": "PRO NODE", 
                "is_active": False, 
                "cpu_cores": 8, 
                "ram_gb": 16, 
                "ghz": 250, 
                "daily_profit": 15.40, 
                "rental_cost": 2.50
            },
            {
                "name": "ELITE NODE", 
                "is_active": False, 
                "cpu_cores": 16, 
                "ram_gb": 32, 
                "ghz": 500, 
                "daily_profit": 31.20, 
                "rental_cost": 5.00
            },
            {
                "name": "ULTIMATE NODE", 
                "is_active": False, 
                "cpu_cores": 32, 
                "ram_gb": 64, 
                "ghz": 1000, 
                "daily_profit": 62.50, 
                "rental_cost": 10.00
            }
        ]
        
        for server_data in servers_data:
            server = Server(
                id=str(uuid.uuid4()),
                user_id=user.id,
                **server_data
            )
            db.add(server)
        
        # Создаем историю транзакций
        transactions_data = [
            {
                "type": "withdrawal", 
                "amount": 150.00, 
                "currency": "USDT", 
                "timestamp": datetime.now() - timedelta(hours=5), 
                "wallet": "0x7f3...4d21", 
                "hash": "0x4d9...c872"
            },
            {
                "type": "withdrawal", 
                "amount": 85.50, 
                "currency": "TON", 
                "timestamp": datetime.now() - timedelta(days=1), 
                "wallet": "EQD...V4R2", 
                "hash": "EQC...9W3F"
            },
            {
                "type": "withdrawal", 
                "amount": 320.00, 
                "currency": "USDT", 
                "timestamp": datetime.now() - timedelta(days=7), 
                "wallet": "0x9e2...7b41", 
                "hash": "0x8f1...d539"
            }
        ]
        
        for transaction_data in transactions_data:
            transaction = Transaction(
                id=str(uuid.uuid4()),
                user_id=user.id,
                **transaction_data
            )
            db.add(transaction)
        
        # Создаем успешные сделки
        trades_data = [
            {
                "pair": "BTC/USDT", 
                "entry_price": 42356.78, 
                "exit_price": 43392.70, 
                "profit_percentage": 2.45, 
                "timestamp": datetime.now() - timedelta(minutes=5)
            },
            {
                "pair": "ETH/USDT", 
                "entry_price": 2356.45, 
                "exit_price": 2398.42, 
                "profit_percentage": 1.78, 
                "timestamp": datetime.now() - timedelta(minutes=12)
            },
            {
                "pair": "TON/USDT", 
                "entry_price": 5.42, 
                "exit_price": 5.59, 
                "profit_percentage": 3.12, 
                "timestamp": datetime.now() - timedelta(minutes=27)
            }
        ]
        
        for trade_data in trades_data:
            trade = Trade(
                id=str(uuid.uuid4()),
                **trade_data
            )
            db.add(trade)
        
        # Создаем задания
        tasks_data = [
            {
                "name": "First Server Rental", 
                "description": "Rent your first server to start earning", 
                "reward": 5.00, 
                "type": "general", 
                "total_steps": 1
            },
            {
                "name": "Upgrade to Pro Node", 
                "description": "Rent a Pro Node server for higher earnings", 
                "reward": 10.00, 
                "type": "general", 
                "total_steps": 1
            },
            {
                "name": "Social Media Share", 
                "description": "Share about EVA on your social media", 
                "reward": 3.00, 
                "type": "general", 
                "total_steps": 1
            },
            {
                "name": "Weekly Active User", 
                "description": "Log in daily for a week to complete", 
                "reward": 7.00, 
                "type": "general", 
                "total_steps": 7
            },
            {
                "name": "Invite 3 Friends", 
                "description": "Get 3 friends to join using your referral link", 
                "reward": 15.00, 
                "type": "referral", 
                "total_steps": 3
            },
            {
                "name": "Referral Milestone", 
                "description": "Reach 10 active referrals", 
                "reward": 25.00, 
                "type": "referral", 
                "total_steps": 10
            },
            {
                "name": "Referral Activity", 
                "description": "Have referrals complete 3 trades each", 
                "reward": 10.00, 
                "type": "referral", 
                "total_steps": 3
            },
            {
                "name": "Referral Leaderboard", 
                "description": "Reach top 10 in monthly referrals", 
                "reward": 50.00, 
                "type": "referral", 
                "total_steps": 1
            }
        ]
        
        task_objects = []
        for task_data in tasks_data:
            task = Task(
                id=str(uuid.uuid4()),
                **task_data
            )
            db.add(task)
            task_objects.append(task)
            db.flush()
        
        # Назначаем некоторые задания пользователю
        user_tasks_data = [
            {"task_id": task_objects[0].id, "progress": 1, "is_completed": True, "is_claimed": True},
            {"task_id": task_objects[1].id, "progress": 0, "is_completed": False, "is_claimed": False},
            {"task_id": task_objects[2].id, "progress": 0, "is_completed": False, "is_claimed": False},
            {"task_id": task_objects[3].id, "progress": 3, "is_completed": False, "is_claimed": False},
            {"task_id": task_objects[4].id, "progress": 1, "is_completed": False, "is_claimed": False},
            {"task_id": task_objects[5].id, "progress": 4, "is_completed": False, "is_claimed": False},
            {"task_id": task_objects[6].id, "progress": 2, "is_completed": False, "is_claimed": False},
            {"task_id": task_objects[7].id, "progress": 0, "is_completed": False, "is_claimed": False}
        ]
        
        for user_task_data in user_tasks_data:
            user_task = UserTask(
                id=str(uuid.uuid4()),
                user_id=user.id,
                **user_task_data
            )
            db.add(user_task)
        
        db.commit()
        print("Тестовые данные созданы успешно")
    except Exception as e:
        db.rollback()
        print(f"Ошибка при создании данных: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_tables()
    create_mock_data()
