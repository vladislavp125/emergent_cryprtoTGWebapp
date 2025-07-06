import React from 'react';

const UserInfo = ({ user, formatNumber }) => {
  return (
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
  );
};

export default UserInfo;
