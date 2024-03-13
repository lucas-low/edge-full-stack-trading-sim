import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { LAMPORTS_PER_SOL,  } from '@solana/web3.js';

const RPC_URL = 'https://api.mainnet-beta.solana.com';
const BASE_URL = "https://quote-api.jup.ag/v6";
const JUP_ADDRESS = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";
const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SLIPPAGE = 100; // 1% Slippage

async function getQuoteBuy(amountToBuyUsdc: number): Promise<number> {
    const amt = amountToBuyUsdc * LAMPORTS_PER_SOL;
    const response = await axios.get(`${BASE_URL}/quote`, {
        params: {
            inputMint: USDC_ADDRESS,
            outputMint: JUP_ADDRESS,
            amount: amt,
            slippageBps: SLIPPAGE,
            swapMode: 'ExactIn',
        },
    });
    return response.data;
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { amountToBuyUsdc, publicKey } = req.body;

  try {
    const quote = await getQuoteBuy(amountToBuyUsdc);
    console.log(`Got quote:`, quote);


    res.status(200).json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the swap.' });
  }
}