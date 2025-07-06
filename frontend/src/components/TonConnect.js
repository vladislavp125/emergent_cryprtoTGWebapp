import React, { useState, useEffect } from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import axios from 'axios';
import TonConnectConfig from './../tonconnect-config';

const TonConnect = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleConnect = async (walletInfo) => {
    setLoading(true);
    setError(null);

    try {
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

  return (
    <TonConnectConfig>
      <div>
        {user ? (
          <div>
            <h2>Welcome, {user.username}!</h2>
            <p>Wallet: {user.wallet_address}</p>
          </div>
        ) : (
          <TonConnectButton
            onConnect={handleConnect}
            disabled={loading}
          />
        )}
        {loading && <p>Connecting...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </TonConnectConfig>
  );
};

export default TonConnect;
