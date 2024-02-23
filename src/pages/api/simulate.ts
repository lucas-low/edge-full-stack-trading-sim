// pages/api/simulate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BASE_URL = "https://quote-api.jup.ag/v6";
const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { amountToBuyUSDC } = req.body;

  try {
    // Fetch the quote from Jupiter's API
    const quoteResponse = await axios.get(`${BASE_URL}/quote`, {
      params: {
        inputMint: USDC_ADDRESS,
        amount: amountToBuyUSDC,
        outputMint: USDC_ADDRESS,
        
      },
    });

    if (quoteResponse.status !== 200 || !quoteResponse.data) {
      throw new Error('Failed to get quote');
    }

    // Return the quote data
    res.status(200).json({ success: true, quote: quoteResponse.data });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quote' });
  }
}
