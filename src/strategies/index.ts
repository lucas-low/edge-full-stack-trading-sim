import { TradingStrategy } from '../types';
import { defaultStrategy } from './defaultStrategy';

const strategies: Record<string, TradingStrategy> = {
  default: defaultStrategy,
};

export const getStrategy = (strategyName: string): TradingStrategy => {
  const strategy = strategies[strategyName];
  if (!strategy) {
    throw new Error(`Trading strategy not found: ${strategyName}`);
  }

  return strategy;
};