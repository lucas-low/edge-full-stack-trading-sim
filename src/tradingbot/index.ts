import { getQuote, swap } from '../jupiter';
import { getBalance, sendTransaction, getPublicKey } from '../solana';
import { logger } from '../logger';
import { getConfig } from '../config';
import { getStrategy } from '../strategies';
import { Quote } from '../types';

const { tradingStrategy } = getConfig();

export const startTradingBot = async (): Promise<void> => {
  logger.info('Trading bot started');

  const publicKey = getPublicKey();
  const balance = await getBalance(publicKey);
  logger.info(`Wallet balance: ${balance} SOL`);

  const inputMint = 'SOL';
  const outputMint = 'USDC';
  const amount = 1;

  const strategy = getStrategy(tradingStrategy);

  while (true) {
    try {
      const quote = await getQuote(inputMint, outputMint, amount);
      logger.info(`Received quote: ${JSON.stringify(quote)}`);

      const shouldTrade = await strategy(quote);
      if (shouldTrade) {
        const txid = await swap(quote);
        logger.info(`Swap executed. Transaction ID: ${txid}`);
      }
    } catch (error) {
      logger.error(`Error occurred: ${error.message}`);
    }
//debounce
    await delay(60000); 
  }
};

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};