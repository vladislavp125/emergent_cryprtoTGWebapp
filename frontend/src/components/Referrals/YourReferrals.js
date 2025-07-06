import React from 'react';

const YourReferrals = () => {
  return (
    <div>
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
  );
};

export default YourReferrals;
