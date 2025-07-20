import axios from 'axios';
import fetchEtfData from 'bitcoin-etf-data';

export type EtfDataRes = { date: string; total: number };
export type PriceDataRes = { usd: number; eur: number };
export type FearAndGreedRes = { value: number; classification: string };
export type NetworkDataRes = { totalNodes: number; blockHeight: number };

export const etfDataFetcher = async (): Promise<EtfDataRes | null> => {
  // Fetch last available day
  const etfData = await fetchEtfData();
  if (!etfData) {
    return null;
  }
  return etfData[etfData.length - 1];
};

export const btcPriceFetcher = async (): Promise<PriceDataRes> => {
  const response = await axios.get('https://api.coinpaprika.com/v1/tickers/btc-bitcoin', {
    params: {
      quotes: 'USD,EUR',
    },
  });

  return {
    usd: response.data.quotes.USD.price,
    eur: response.data.quotes.EUR.price,
  };
};

export const fearGreedIndexFetcher = async (): Promise<FearAndGreedRes> => {
  const response = await axios.get('https://api.alternative.me/fng/');

  return {
    value: response.data.data[0].value,
    classification: response.data.data[0].value_classification,
  };
};

export const fetchNetworkData = async (): Promise<NetworkDataRes> => {
  const response = await axios.get('https://bitnodes.io/api/v1/snapshots/latest/');

  return {
    totalNodes: response.data.total_nodes,
    blockHeight: response.data.latest_height,
  };
};
