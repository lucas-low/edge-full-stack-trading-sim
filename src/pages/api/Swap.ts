import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { amountToBuyUSDC } = req.body; 
        const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL as string);
        const BASE_URL = "https://quote-api.jup.ag/v6";
        const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

        const quoteResponse = await axios.get(`${BASE_URL}/quote`, {
            params: {
                inputMint: USDC_ADDRESS,
                amount: amountToBuyUSDC,
            },
        });

        if (quoteResponse.status !== 200 || !quoteResponse.data) {
            throw new Error('Failed to get quote');
        }

        const quoteData = quoteResponse.data;
        console.log(quoteData);

        // Due to security concerns, actual swap operations (e.g., signing transactions) should be handled server-side or in a secure environment

        return res.status(200).json({ success: true, data: quoteData });
    } catch (error: any) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
