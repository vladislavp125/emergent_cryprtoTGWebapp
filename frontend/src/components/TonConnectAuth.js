import React, { useState, useEffect } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import axios from 'axios';
import TonConnectConfig from '../../tonconnect-config';

const TonConnectAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { connectWallet, disconnectWallet, walletInfo } = useTonConnectUI();

  useEffect(() => {
    // Fetch the current user from the backend
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user/current');
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Error fetching user');
      }
    };

    fetchUser();
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      // Connect to the wallet
      await connectWallet();

      // Send the wallet address to the backend for authentication
      const response = await axios.post('/api/auth/ton-connect', {
        username: walletInfo.name,
        wallet_address: walletInfo.account.address,
      });

      // Store the token in local storage
      localStorage.setItem('token', response.data.access_token);

      // Fetch the user information
      const userResponse = await axios.get('/api/user/current', {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });

      setUser(userResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error connecting wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError(null);

    try {
      // Disconnect from the wallet
      await disconnectWallet();

      // Remove the token from local storage
      localStorage.removeItem('token');

      // Clear the user information
      setUser(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error disconnecting wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TonConnectConfig>
      <div>
        {user ? (
          <div>
            <h2>Welcome, {user.username}!</h2>
            <p>Wallet: {user.wallet_address}</p>
            <button onClick={handleDisconnect} disabled={loading}>
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={handleConnect} disabled={loading}>
            Connect Wallet
          </button>
        )}
        {loading && <p>Connecting...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </TonConnectConfig>
  );
};

export default TonConnectAuth;
