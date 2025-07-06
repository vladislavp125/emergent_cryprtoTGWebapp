from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
import uuid

# Базовые схемы

class ServerBase(BaseModel):
    name: str
    is_active: bool
    cpu_cores: int
    ram_gb: int
    ghz: int
    daily_profit: float
    rental_cost: float

class ServerCreate(ServerBase):
    pass

class Server(ServerBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class TradeBase(BaseModel):
    pair: str
    entry_price: float
    exit_price: float
    profit_percentage: float
    timestamp: datetime

class TradeCreate(TradeBase):
    pass

class Trade(TradeBase):
    id: str

    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    type: str
    amount: float
    currency: str
    wallet: str
    hash: str

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    timestamp: datetime
    user_id: str

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    name: str
    description: str
    reward: float
    type: str
    total_steps: int = 1

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str

    class Config:
        from_attributes = True

class UserTaskBase(BaseModel):
    task_id: str
    progress: int = 0
    is_completed: bool = False
    is_claimed: bool = False

class UserTaskCreate(UserTaskBase):
    pass

class UserTask(UserTaskBase):
    id: str
    user_id: str
    task: Task

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    wallet_address: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    created_at: datetime
    total_earnings: float
    server_earnings: float
    referral_earnings: float
    available_balance: float
    is_active: bool

    class Config:
        from_attributes = True

class UserWithDetails(User):
    servers: List[Server] = []
    transactions: List[Transaction] = []
    tasks: List[UserTask] = []

    class Config:
        from_attributes = True

# Дополнительные схемы для API

class StatsResponse(BaseModel):
    total_earnings: float
    server_earnings: float
    referral_earnings: float
    active_servers: int
    profitability: int = 87
    success_rate: int = 92
    server_capacity: int = 60

class RentServerRequest(BaseModel):
    server_id: str

class WithdrawRequest(BaseModel):
    amount: float
    currency: str
    wallet_address: str

class ReferralStats(BaseModel):
    total_referrals: int
    total_earned: float
    level_1_referrals: int
    level_2_referrals: int
    referral_link: str

class TonConnectRequest(BaseModel):
    username: str
    wallet_address: str

class TokenData(BaseModel):
    username: str
    is_active: bool = True
