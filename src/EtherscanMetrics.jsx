import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EtherscanMetrics = ({ walletAddress }) => {
  const [balance, setBalance] = useState(null);
  const [txCount, setTxCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const etherscanApiKey = 'GPTSNRW46NR1EDQ33W26EPVK5QCNGKY1JZ'; // Replace with your Etherscan API key
  const fetchData = async () => {
    try {
      const balanceResponse = await axios.get(
        `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&apikey=${etherscanApiKey}`
      );

      if (balanceResponse.data.status === '1') {
        setBalance(balanceResponse.data.result);
      } else {
        setError(balanceResponse.data.message);
      }

      const txCountResponse = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&apikey=${etherscanApiKey}`
      );

      if (txCountResponse.data.status === '1') {
        setTxCount(txCountResponse.data.result.length);
      } else {
        setError(txCountResponse.data.message);
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();
  }, [walletAddress]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {balance !== null && <p>Balance: {balance}</p>}
      {txCount !== null && <p>Transaction Count: {txCount}</p>}
    </div>
  );
};

export default EtherscanMetrics;
