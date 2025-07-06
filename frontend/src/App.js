import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TonConnect from './components/TonConnect';
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
import TonConnectConfig from './tonconnect-config';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user:', error);
      setIsAuthenticated(false);
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
    fetchUser(); // Проверяем аутентификацию пользователя

    // Запускаем периодическое обновление живых сделок
    const tradeInterval = setInterval(() => {
      fetchLiveTrade();
    }, 8000); // Обновляем каждые 8 секунд

    return () => clearInterval(tradeInterval);
  }, [fetchUser, fetchLiveTrade]);

  // Загрузка данных после аутентификации
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchServers();
      fetchTrades();
      fetchTransactions();
      fetchTasks();
      fetchReferralStats();
    }
  }, [isAuthenticated, fetchStats, fetchServers, fetchTrades, fetchTransactions, fetchTasks, fetchReferralStats]);

  // Обновление транзакций при смене типа
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [transactionType, fetchTransactions, isAuthenticated]);

  // Обновление заданий при смене типа
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [activeTaskType, fetchTasks, isAuthenticated]);

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

  // Проверка аутентификации
  if (!isAuthenticated) {
    return (
      <TonConnectConfig>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold text-center orbitron glow-text mb-4">EVA AI TRADER</h1>
          <p className="text-center text-gray-300 mb-6">Please connect your wallet to access the application</p>
          <TonConnect />
        </div>
      </TonConnectConfig>
    );
  }

  return (
    <TonConnectConfig>
      <div className="flex flex-col h-screen">
        {/* Основной контент */}
        <div className="flex-1 overflow-y-auto p-4 pb-20">
          {/* AI Tab (Default) */}
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

            <AIStats stats={stats} />

            <SuccessfulTrades trades={trades} formatTimeAgo={formatTimeAgo} formatNumber={formatNumber} />

            <TransactionHistory
              transactions={transactions}
              transactionType={transactionType}
              setTransactionType={setTransactionType}
              formatTimeAgo={formatTimeAgo}
              copyToClipboard={copyToClipboard}
            />
          </div>

          {/* Servers Tab */}
          <div id="servers-tab" className={`tab-content ${activeTab === 'servers-tab' ? 'active' : ''}`}>
            <h2 className="text-2xl font-bold mb-4 orbitron glow-text">SERVER POWER</h2>
            <p className="text-gray-300 mb-6">Upgrade your servers to increase EVA's trading capacity and earnings</p>

            <ServersList servers={servers} rentServer={rentServer} />
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
                  <ReferralStats
                    referralStats={referralStats}
                    formatNumber={formatNumber}
                    copyToClipboard={copyToClipboard}
                  />
                  <TopReferrals />
                </div>

                {/* Your Referrals Panel */}
                <div className={`swipe-tab-panel ${activeReferralTab === 'your-referrals' ? 'active' : ''}`} id="your-referrals">
                  <YourReferrals />
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
                  <TasksList tasks={tasks} activeTaskType={activeTaskType} />
                </div>

                {/* Referral Tasks Panel */}
                <div className={`swipe-tab-panel ${activeTaskType === 'referral' ? 'active' : ''}`} id="referral-tasks">
                  <TasksList tasks={tasks} activeTaskType={activeTaskType} />
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

            <UserInfo user={user} formatNumber={formatNumber} />

            <ProfileActions handleTabChange={handleTabChange} />

            <div className="text-center text-xs text-gray-500">
              <p>EVA AI Trade Bot v2.1.4</p>
              <p>© 2023 EVA Technologies. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
      </div>
    </TonConnectConfig>
  );
}

export default App;
