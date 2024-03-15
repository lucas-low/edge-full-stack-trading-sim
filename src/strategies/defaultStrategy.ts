import { Quote, TradingStrategy } from '../types';

export const defaultStrategy: TradingStrategy = async (quote: Quote): Promise<boolean> => {
  const { price, fee } = quote;
  const threshold = 1.01; // 1% price threshold

  return price * (1 + fee) < threshold;
};