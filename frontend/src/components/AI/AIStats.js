import React from 'react';

const AIStats = ({ stats }) => {
  return (
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
  );
};

export default AIStats;
