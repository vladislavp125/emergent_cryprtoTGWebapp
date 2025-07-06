import React from 'react';

const SuccessfulTrades = ({ trades, formatTimeAgo, formatNumber }) => {
  return (
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
  );
};

export default SuccessfulTrades;
