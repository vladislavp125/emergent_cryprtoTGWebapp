import React from 'react';

const ReferralStats = ({ referralStats, formatNumber, copyToClipboard }) => {
  return (
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
  );
};

export default ReferralStats;
