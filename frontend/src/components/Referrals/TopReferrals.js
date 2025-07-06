import React from 'react';

const TopReferrals = () => {
  return (
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
  );
};

export default TopReferrals;
