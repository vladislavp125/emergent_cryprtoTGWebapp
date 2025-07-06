import React from 'react';

const ServerCard = ({ server, rentServer }) => {
  return (
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
  );
};

export default ServerCard;
