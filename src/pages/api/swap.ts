import type { NextApiRequest, NextApiResponse } from 'next';
import { getQuoteBuy } from '../../utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { amountToBuyUsdc, publicKey, slippageBps } = req.body;

    try {
        const quote = await getQuoteBuy(amountToBuyUsdc, slippageBps);
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