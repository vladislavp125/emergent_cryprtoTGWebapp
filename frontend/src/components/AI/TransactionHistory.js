import React from 'react';

const TransactionHistory = ({ transactions, transactionType, setTransactionType, formatTimeAgo, copyToClipboard }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
      <h3 className="font-bold text-lg mb-4 orbitron">TRANSACTION HISTORY</h3>
      <div className="flex mb-3 border-b border-gray-700 pb-2">
        <button
          className={`flex-1 text-sm font-medium ${transactionType === 'all' ? 'text-primary border-b-2 border-primary pb-1' : ''}`}
          onClick={() => setTransactionType('all')}
        >
          All
        </button>
        <button
          className={`flex-1 text-sm font-medium ${transactionType === 'withdrawal' ? 'text-primary border-b-2 border-primary pb-1' : ''}`}
          onClick={() => setTransactionType('withdrawal')}
        >
          Withdrawals
        </button>
        <button
          className={`flex-1 text-sm font-medium ${transactionType === 'deposit' ? 'text-primary border-b-2 border-primary pb-1' : ''}`}
          onClick={() => setTransactionType('deposit')}
        >
          Deposits
        </button>
      </div>
      <div className="space-y-3">
        {transactions.slice(0, 3).map((transaction) => (
          <div key={transaction.id} className="transaction-card rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className={`${transaction.currency === 'USDT' ? 'usdt-badge' : 'ton-badge'} text-xs px-2 py-1 rounded mr-2`}>
                  {transaction.currency}
                </span>
                <span className="text-xs text-gray-400">{formatTimeAgo(transaction.timestamp)}</span>
              </div>
              <span className="text-red-400 font-bold">-{transaction.amount.toFixed(2)} {transaction.currency}</span>
            </div>
            <div className="text-xs text-gray-400 mb-1">Wallet: <span className="font-mono">{transaction.wallet}</span></div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Hash: <span className="font-mono">{transaction.hash}</span></span>
              <button
                className="copy-btn text-gray-400 hover:text-primary"
                onClick={() => copyToClipboard(transaction.hash)}
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-3 text-sm text-gray-400 hover:text-primary flex items-center justify-center">
        Load more transactions <i className="fas fa-chevron-down ml-2"></i>
      </button>
    </div>
  );
};

export default TransactionHistory;
