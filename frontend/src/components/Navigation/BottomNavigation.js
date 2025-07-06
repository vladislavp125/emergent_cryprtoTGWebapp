import React from 'react';

const BottomNavigation = ({ activeTab, handleTabChange }) => {
  return (
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
  );
};

export default BottomNavigation;
