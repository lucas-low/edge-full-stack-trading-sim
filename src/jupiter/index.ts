import axios from 'axios';
import { getConfig } from '../config';
import { Quote } from '../types';

const { jupiterEndpoint } = getConfig();

export const getQuote = async (inputMint: string, outputMint: string, amount: number): Promise<Quote> => {
  try {
    const response = await axios.get(`${jupiterEndpoint}/quote`, {
      params: {
        inputMint,
        outputMint,
        amount,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get quote: ${error.message}`);
  }
};

export const swap = async (quote: Quote): Promise<string> => {
  try {
    const response = await axios.post(`${jupiterEndpoint}/swap`, quote);
    return response.data.txid;
  } catch (error) {
    throw new Error(`Failed to execute swap: ${error.message}`);
  }
};