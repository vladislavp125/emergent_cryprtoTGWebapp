import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {TonConnectButton} from "@tonconnect/ui-react";
import AIStats from './components/AI/AIStats';
import SuccessfulTrades from './components/AI/SuccessfulTrades';
import TransactionHistory from './components/AI/TransactionHistory';
import ServersList from './components/Servers/ServersList';
import ReferralStats from './components/Referrals/ReferralStats';
import TopReferrals from './components/Referrals/TopReferrals';
import YourReferrals from './components/Referrals/YourReferrals';
import TasksList from './components/Tasks/TasksList';
import UserInfo from './components/Profile/UserInfo';
import ProfileActions from './components/Profile/ProfileActions';
import BottomNavigation from './components/Navigation/BottomNavigation';


function App() {
  // Получаем URL бэкенда из переменных окружения
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
  console.log('Backend URL:', BACKEND_URL);
  
  // Состояния приложения
  const [activeTab, setActiveTab] = useState('ai-tab');
  const [stats, setStats] = useState({
    total_earnings: 0,
    server_earnings: 0,
    referral_earnings: 0,
    active_servers: 0,
    profitability: 87,
    success_rate: 92,
    server_capacity: 60
  });
  const [servers, setServers] = useState([]);
  const [trades, setTrades] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState('withdrawal');
  const [tasks, setTasks] = useState([]);
  const [activeTaskType, setActiveTaskType] = useState('general');
  const [activeReferralTab, setActiveReferralTab] = useState('top-referrals');
  const [referralStats, setReferralStats] = useState({
    total_referrals: 0,
    total_earned: 0,
    level_1_referrals: 0,
    level_2_referrals: 0,
    referral_link: ''
  });
  const [user, setUser] = useState(null);
  
  // Загрузка данных
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/stats`);
      console.log('Stats response:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [BACKEND_URL]);
  
  const fetchServers = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/servers`);
      console.log('Servers response:', response.data);
      setServers(response.data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  }, [BACKEND_URL]);
  
  const fetchTrades = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/trades`);
      console.log('Trades response:', response.data);
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  }, [BACKEND_URL]);
  
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/transactions?transaction_type=${transactionType}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [BACKEND_URL, transactionType]);
  
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/tasks?task_type=${activeTaskType}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [BACKEND_URL, activeTaskType]);
  
  const fetchReferralStats = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/referrals/stats`);
      setReferralStats(response.data);
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    }
  }, [BACKEND_URL]);
  
  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/user/current`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [BACKEND_URL]);
  
  // Получение новой "живой" сделки
  const fetchLiveTrade = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/trades/live`);
      setTrades(prevTrades => [response.data, ...prevTrades.slice(0, 9)]);
    } catch (error) {
      console.error('Error fetching live trade:', error);
    }
  }, [BACKEND_URL]);
  
  // Аренда сервера
  const rentServer = async (serverId) => {
    try {
      await axios.post(`${BACKEND_URL}/api/servers/rent`, {
        server_id: serverId
      });
      fetchServers();
      fetchStats();
    } catch (error) {
      console.error('Error renting server:', error);
    }
  };
  
  // Загрузка данных при первом рендере
  useEffect(() => {
    fetchStats();
    fetchServers();
    fetchTrades();
    fetchTransactions();
    fetchTasks();
    fetchReferralStats();
    fetchUser();
    
    // Запускаем периодическое обновление живых сделок
    const tradeInterval = setInterval(() => {
      fetchLiveTrade();
    }, 8000); // Обновляем каждые 8 секунд
    
    return () => clearInterval(tradeInterval);
  }, [fetchStats, fetchServers, fetchTrades, fetchTransactions, fetchTasks, fetchReferralStats, fetchUser, fetchLiveTrade]);
  
  // Обновление транзакций при смене типа
  useEffect(() => {
    fetchTransactions();
  }, [transactionType, fetchTransactions]);
  
  // Обновление заданий при смене типа
  useEffect(() => {
    fetchTasks();
  }, [activeTaskType, fetchTasks]);
  
  // Обработчик переключения табов
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Функция для форматирования времени
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);
    
    if (secondsAgo < 60) {
      return `${secondsAgo} сек. назад`;
    } else if (secondsAgo < 3600) {
      return `${Math.floor(secondsAgo / 60)} мин. назад`;
    } else if (secondsAgo < 86400) {
      return `${Math.floor(secondsAgo / 3600)} ч. назад`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Функция для копирования в буфер обмена
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  // Функция для форматирования чисел
  const formatNumber = (number) => {
    return Number(number).toFixed(2);
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Основной контент */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {/* AI Tab (Default) */}
        <TonConnectButton />
        <div id="ai-tab" className={`tab-content ${activeTab === 'ai-tab' ? 'active' : ''}`}>
          <div className="eva-container">
            <div className="eva">
              <div className="eva-eye left"></div>
              <div className="eva-eye right"></div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center orbitron glow-text mb-2">EVA AI TRADER</h1>
          <p className="text-center text-gray-300 mb-6">Advanced trading algorithm powered by artificial intelligence</p>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-6 border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Total Earnings</span>
              <span className="font-bold text-xl text-green-400">${formatNumber(stats.total_earnings)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Server Earnings</span>
              <span className="font-bold text-green-400">${formatNumber(stats.server_earnings)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Referral Earnings</span>
              <span className="font-bold text-green-400">${formatNumber(stats.referral_earnings)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Active Servers</span>
              <span className="font-bold text-primary">{stats.active_servers}/5</span>
            </div>
          </div>
          
          <button 
            id="start-earning-btn" 
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-bold orbitron text-lg flex items-center justify-center pulse mb-6"
            onClick={() => handleTabChange('servers-tab')}
          >
            <i className="fas fa-rocket mr-2"></i> START EARNING
          </button>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700 mb-6">
            <h3 className="font-bold text-lg mb-3 orbitron">EVA STATS</h3>
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span>Profitability</span>
                <span>{stats.profitability}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.profitability}%` }}></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span>Success Rate</span>
                <span>{stats.success_rate}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.success_rate}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Server Capacity</span>
                <span>{stats.server_capacity}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.server_capacity}%` }}></div>
              </div>
            </div>
          </div>
          
          {/* Successful Trades Section */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg orbitron">SUCCESSFUL TRADES</h3>
              <span className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded">LIVE</span>
            </div>
            <div className="space-y-3">
              {trades.slice(0, 3).map((trade) => (
                <div key={trade.id} className="trade-card rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className={`bg-${trade.pair.split('/')[0] === 'BTC' ? 'blue' : trade.pair.split('/')[0] === 'ETH' ? 'purple' : 'yellow'}-600 text-white text-xs px-2 py-1 rounded mr-2`}>
                        {trade.pair}
                      </span>
                      <span className="text-xs text-gray-400">{formatTimeAgo(trade.timestamp)}</span>
                    </div>
                    <span className="text-green-400 font-bold">+{trade.profit_percentage.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Entry: <span className="font-mono">${trade.entry_price.toFixed(2)}</span></span>
                    <span>Exit: <span className="font-mono">${trade.exit_price.toFixed(2)}</span></span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-sm text-gray-400 hover:text-primary flex items-center justify-center">
              View all trades <i className="fas fa-chevron-down ml-2"></i>
            </button>
          </div>
          
          {/* Transaction History Section */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
            <h3 className="font-bold text-lg mb-4 orbitron">TRANSACTION HISTORY</h3>
            <div className="flex mb-3 border-b border-gray-700 pb-2">
              <button 
                className={`flex-1 text-sm font-medium ${transactionType === 'all' ? 'text-primary border-b-2 border-primary pb-1' : ''}`}
                onClick={() => setTransactionType('all')}
              >
                All
              </button>
              <button 
                className={`flex-1 text-sm font-medium ${transactionType === 'withdrawal' ? 'text-primary border-b-2 border-primary pb-1' : ''}`}
                onClick={() => setTransactionType('withdrawal')}
              >
                Withdrawals
              </button>
              <button 
                className={`flex-1 text-sm font-medium ${transactionType === 'deposit' ? 'text-primary border-b-2 border-primary pb-1' : ''}`}
                onClick={() => setTransactionType('deposit')}
              >
                Deposits
              </button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="transaction-card rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className={`${transaction.currency === 'USDT' ? 'usdt-badge' : 'ton-badge'} text-xs px-2 py-1 rounded mr-2`}>
                        {transaction.currency}
                      </span>
                      <span className="text-xs text-gray-400">{formatTimeAgo(transaction.timestamp)}</span>
                    </div>
                    <span className="text-red-400 font-bold">-{transaction.amount.toFixed(2)} {transaction.currency}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">Wallet: <span className="font-mono">{transaction.wallet}</span></div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Hash: <span className="font-mono">{transaction.hash}</span></span>
                    <button 
                      className="copy-btn text-gray-400 hover:text-primary"
                      onClick={() => copyToClipboard(transaction.hash)}
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-sm text-gray-400 hover:text-primary flex items-center justify-center">
              Load more transactions <i className="fas fa-chevron-down ml-2"></i>
            </button>
          </div>
        </div>
        
        {/* Servers Tab */}
        <div id="servers-tab" className={`tab-content ${activeTab === 'servers-tab' ? 'active' : ''}`}>
          <h2 className="text-2xl font-bold mb-4 orbitron glow-text">SERVER POWER</h2>
          <p className="text-gray-300 mb-6">Upgrade your servers to increase EVA's trading capacity and earnings</p>
          
          <div className="space-y-4">
            {servers.map((server) => (
              <div key={server.id} className="server-card rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{server.name}</h3>
                  <span className={`bg-${server.is_active ? 'green' : 'blue'}-900 bg-opacity-50 text-${server.is_active ? 'green' : 'blue'}-400 text-xs px-2 py-1 rounded`}>
                    {server.is_active ? 'ACTIVE' : 'AVAILABLE'}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-300 mb-3">
                  <span><i className="fas fa-microchip mr-1"></i> {server.cpu_cores} CPU</span>
                  <span><i className="fas fa-memory mr-1"></i> {server.ram_gb}GB RAM</span>
                  <span><i className="fas fa-bolt mr-1"></i> {server.ghz} GH/s</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-xs text-gray-400">Daily Profit</div>
                    <div className="font-bold text-green-400">${server.daily_profit.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Rental Cost</div>
                    <div className="font-bold">${server.rental_cost.toFixed(2)}/day</div>
                  </div>
                </div>
                {server.is_active ? (
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition">
                    MANAGE SERVER
                  </button>
                ) : (
                  <button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg text-sm font-medium transition"
                    onClick={() => rentServer(server.id)}
                  >
                    RENT SERVER
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Referrals Tab */}
        <div id="referrals-tab" className={`tab-content ${activeTab === 'referrals-tab' ? 'active' : ''}`}>
          <h2 className="text-2xl font-bold mb-4 orbitron glow-text">REFERRAL PROGRAM</h2>
          <p className="text-gray-300 mb-6">Earn 2% from level 1 and 1% from level 2 referrals</p>
          
          <div className="swipe-tabs-container">
            <div className="swipe-tabs-header">
              <button 
                className={`swipe-tab-btn ${activeReferralTab === 'top-referrals' ? 'active' : ''}`}
                onClick={() => setActiveReferralTab('top-referrals')}
              >
                Top Referrals
              </button>
              <button 
                className={`swipe-tab-btn ${activeReferralTab === 'your-referrals' ? 'active' : ''}`}
                onClick={() => setActiveReferralTab('your-referrals')}
              >
                Your Referrals
              </button>
            </div>
            
            <div className="swipe-tabs-content" style={{ transform: activeReferralTab === 'top-referrals' ? 'translateX(0)' : 'translateX(-50%)' }}>
              {/* Top Referrals Panel */}
              <div className={`swipe-tab-panel ${activeReferralTab === 'top-referrals' ? 'active' : ''}`} id="top-referrals">
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700 mb-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Total Referrals</div>
                      <div className="font-bold text-xl">{referralStats.total_referrals}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Total Earned</div>
                      <div className="font-bold text-xl text-green-400">${formatNumber(referralStats.total_earned)}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>Level 1 Referrals</span>
                      <span>{referralStats.level_1_referrals}</span>
                    </div>
                    <div className="progress-bar mt-1">
                      <div className="progress-fill" style={{ width: `${(referralStats.level_1_referrals / referralStats.total_referrals) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Level 2 Referrals</span>
                      <span>{referralStats.level_2_referrals}</span>
                    </div>
                    <div className="progress-bar mt-1">
                      <div className="progress-fill" style={{ width: `${(referralStats.level_2_referrals / referralStats.total_referrals) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Your Referral Link</h3>
                  <div className="flex">
                    <input 
                      type="text" 
                      value={referralStats.referral_link} 
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-3 py-2 text-sm" 
                      readOnly
                    />
                    <button 
                      className="bg-green-600 hover:bg-green-700 px-3 rounded-r-lg"
                      onClick={() => copyToClipboard(referralStats.referral_link)}
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Top Referrers</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">1</div>
                        <div>
                          <div className="font-medium">@cryptoking</div>
                          <div className="text-xs text-gray-400">$245.60 earned</div>
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">32 refs</div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">2</div>
                        <div>
                          <div className="font-medium">@blockchainqueen</div>
                          <div className="text-xs text-gray-400">$198.75 earned</div>
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">28 refs</div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">3</div>
                        <div>
                          <div className="font-medium">@bitcoinmaxi</div>
                          <div className="text-xs text-gray-400">$156.30 earned</div>
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">24 refs</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Your Referrals Panel */}
              <div className={`swipe-tab-panel ${activeReferralTab === 'your-referrals' ? 'active' : ''}`} id="your-referrals">
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700 mb-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Your Referrals</div>
                      <div className="font-bold text-xl">12</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Earned From Them</div>
                      <div className="font-bold text-xl text-green-400">$142.50</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Referrals</span>
                      <span>8</span>
                    </div>
                    <div className="progress-bar mt-1">
                      <div className="progress-fill" style={{ width: '66%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Inactive Referrals</span>
                      <span>4</span>
                    </div>
                    <div className="progress-bar mt-1">
                      <div className="progress-fill" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Your Referrals</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <div className="font-medium">@traderjoe</div>
                          <div className="text-xs text-gray-400">Level 1 - Active 15 days</div>
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">$42.50</div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <div className="font-medium">@cryptogirl</div>
                          <div className="text-xs text-gray-400">Level 1 - Active 8 days</div>
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">$28.90</div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <div className="font-medium">@altcoinlover</div>
                          <div className="text-xs text-gray-400">Level 2 - Active 22 days</div>
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">$15.75</div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <div className="font-medium">@daytrader</div>
                          <div className="text-xs text-gray-400">Level 1 - Inactive</div>
                        </div>
                      </div>
                      <div className="text-gray-400 font-bold">$0.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tasks Tab */}
        <div id="tasks-tab" className={`tab-content ${activeTab === 'tasks-tab' ? 'active' : ''}`}>
          <h2 className="text-2xl font-bold mb-4 orbitron glow-text">MISSIONS</h2>
          <p className="text-gray-300 mb-6">Complete missions to boost your earnings</p>
          
          <div className="swipe-tabs-container">
            <div className="swipe-tabs-header">
              <button 
                className={`swipe-tab-btn ${activeTaskType === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTaskType('general')}
              >
                General
              </button>
              <button 
                className={`swipe-tab-btn ${activeTaskType === 'referral' ? 'active' : ''}`}
                onClick={() => setActiveTaskType('referral')}
              >
                Referral
              </button>
            </div>
            
            <div className="swipe-tabs-content" style={{ transform: activeTaskType === 'general' ? 'translateX(0)' : 'translateX(-50%)' }}>
              {/* General Tasks Panel */}
              <div className={`swipe-tab-panel ${activeTaskType === 'general' ? 'active' : ''}`} id="general-tasks">
                <div className="space-y-4">
                  {tasks.filter(task => task.task.type === 'general').map((userTask) => (
                    <div key={userTask.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{userTask.task.name}</h3>
                          <p className="text-sm text-gray-400">{userTask.task.description}</p>
                        </div>
                        <span className="bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs px-2 py-1 rounded">+${userTask.task.reward.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {userTask.task.total_steps > 1 ? (
                          <>
                            <div className="text-xs text-gray-500">{userTask.progress}/{userTask.task.total_steps} days</div>
                            <div className="flex space-x-1">
                              {Array.from({ length: userTask.task.total_steps }).map((_, index) => (
                                <div 
                                  key={index}
                                  className={`w-3 h-3 rounded-full ${index < userTask.progress ? 'bg-green-500' : 'bg-gray-600'}`}
                                ></div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-xs text-gray-500">
                              {userTask.is_completed ? (
                                userTask.is_claimed ? "Completed" : "Not started"
                              ) : "Not started"}
                            </div>
                            {userTask.is_completed ? (
                              userTask.is_claimed ? (
                                <button className="text-xs text-green-400 font-bold" disabled>
                                  <i className="fas fa-check-circle mr-1"></i> CLAIMED
                                </button>
                              ) : (
                                <button className="text-xs text-blue-400 font-bold">
                                  <i className="fas fa-gift mr-1"></i> CLAIM
                                </button>
                              )
                            ) : (
                              <button className="text-xs text-blue-400 font-bold">
                                {userTask.task.name === "Upgrade to Pro Node" ? (
                                  <><i className="fas fa-arrow-right mr-1"></i> UPGRADE</>
                                ) : userTask.task.name === "Social Media Share" ? (
                                  <><i className="fas fa-share-alt mr-1"></i> SHARE</>
                                ) : (
                                  <><i className="fas fa-arrow-right mr-1"></i> START</>
                                )}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Referral Tasks Panel */}
              <div className={`swipe-tab-panel ${activeTaskType === 'referral' ? 'active' : ''}`} id="referral-tasks">
                <div className="space-y-4">
                  {tasks.filter(task => task.task.type === 'referral').map((userTask) => (
                    <div key={userTask.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{userTask.task.name}</h3>
                          <p className="text-sm text-gray-400">{userTask.task.description}</p>
                        </div>
                        <span className="bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs px-2 py-1 rounded">+${userTask.task.reward.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {userTask.task.name === "Referral Leaderboard" ? (
                            "Current rank: 15"
                          ) : (
                            `${userTask.progress}/${userTask.task.total_steps} ${userTask.task.name === "Invite 3 Friends" ? "completed" : userTask.task.name === "Referral Milestone" ? "completed" : "referrals"}`
                          )}
                        </div>
                        <button className="text-xs text-blue-400 font-bold">
                          {userTask.task.name === "Invite 3 Friends" ? (
                            <><i className="fas fa-external-link-alt mr-1"></i> INVITE</>
                          ) : userTask.task.name === "Referral Milestone" ? (
                            <><i className="fas fa-users mr-1"></i> VIEW</>
                          ) : userTask.task.name === "Referral Activity" ? (
                            <><i className="fas fa-chart-line mr-1"></i> TRACK</>
                          ) : (
                            <><i className="fas fa-trophy mr-1"></i> VIEW</>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Tab */}
        <div id="profile-tab" className={`tab-content ${activeTab === 'profile-tab' ? 'active' : ''}`}>
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mr-4">
              <i className="fas fa-user-astronaut text-2xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold">@{user?.username || 'user'}</h2>
              <p className="text-gray-400 text-sm">
                Member since: {user ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700 mb-6">
            <h3 className="font-bold mb-3 orbitron">USER INFO</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">User ID</span>
                <span className="font-mono">EVATB-7845-2291</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wallet Address</span>
                <span className="font-mono text-sm">{user?.wallet_address || '0x0000...0000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Earned</span>
                <span className="text-green-400 font-bold">${formatNumber(user?.total_earnings || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available Balance</span>
                <span className="text-green-400 font-bold">${formatNumber(user?.available_balance || 0)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-between px-4">
              <span>Withdraw Earnings</span>
              <i className="fas fa-wallet"></i>
            </button>
            <button 
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-between px-4"
              onClick={() => handleTabChange('ai-tab')}
            >
              <span>Transaction History</span>
              <i className="fas fa-history"></i>
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-between px-4">
              <span>FAQ</span>
              <i className="fas fa-question-circle"></i>
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-between px-4">
              <span>Support</span>
              <i className="fas fa-headset"></i>
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg flex items-center justify-between px-4">
              <span>Documentation</span>
              <i className="fas fa-book"></i>
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            <p>EVA AI Trade Bot v2.1.4</p>
            <p>© 2023 EVA Technologies. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around py-2">
        <button 
          data-tab="tasks-tab" 
          className={`nav-btn flex flex-col items-center p-2 text-${activeTab === 'tasks-tab' ? 'primary' : 'gray-400'}`}
          onClick={() => handleTabChange('tasks-tab')}
        >
          <i className="fas fa-tasks text-lg mb-1"></i>
          <span className="text-xs">TASKS</span>
        </button>
        <button 
          data-tab="referrals-tab" 
          className={`nav-btn flex flex-col items-center p-2 text-${activeTab === 'referrals-tab' ? 'primary' : 'gray-400'}`}
          onClick={() => handleTabChange('referrals-tab')}
        >
          <i className="fas fa-users text-lg mb-1"></i>
          <span className="text-xs">REFERRALS</span>
        </button>
        <button 
          data-tab="ai-tab" 
          className={`nav-btn flex flex-col items-center p-2 text-${activeTab === 'ai-tab' ? 'primary' : 'gray-400'}`}
          onClick={() => handleTabChange('ai-tab')}
        >
          <i className="fas fa-robot text-lg mb-1"></i>
          <span className="text-xs">AI</span>
        </button>
        <button 
          data-tab="servers-tab" 
          className={`nav-btn flex flex-col items-center p-2 text-${activeTab === 'servers-tab' ? 'primary' : 'gray-400'}`}
          onClick={() => handleTabChange('servers-tab')}
        >
          <i className="fas fa-server text-lg mb-1"></i>
          <span className="text-xs">SERVERS</span>
        </button>
        <button 
          data-tab="profile-tab" 
          className={`nav-btn flex flex-col items-center p-2 text-${activeTab === 'profile-tab' ? 'primary' : 'gray-400'}`}
          onClick={() => handleTabChange('profile-tab')}
        >
          <i className="fas fa-user text-lg mb-1"></i>
          <span className="text-xs">PROFILE</span>
        </button>
      </div>
    </div>
  );
}

export default App;
