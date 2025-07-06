import React from 'react';

const ProfileActions = ({ handleTabChange }) => {
  return (
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
  );
};

export default ProfileActions;
