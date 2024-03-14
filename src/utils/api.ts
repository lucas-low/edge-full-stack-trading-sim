import axios from 'axios';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const RPC_URL = 'https://api.mainnet-beta.solana.com';
const BASE_URL = "https://quote-api.jup.ag/v6";
const JUP_ADDRESS = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";
const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const getQuoteBuy = async (amountToBuyUsdc: number, slippageBps: number): Promise<number> => {
    const amt = amountToBuyUsdc * LAMPORTS_PER_SOL;
    const response = await axios.get(`${BASE_URL}/quote`, {
        params: {
            inputMint: USDC_ADDRESS,
            outputMint: JUP_ADDRESS,
            amount: amt,
            slippageBps,
            swapMode: 'ExactIn',
        },
    });
    return response.data;
};

export const getOhlcData = async () => {
    const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/jupiter-exchange-solana/ohlc?vs_currency=usd&days=1"
    );
    return response.data;
};

export const swap = async (
    amountToBuyUsdc: number,
    publicKey: string,
    slippageBps: number 
) => {
    const response = await axios.post("/api/swap", {
        amountToBuyUsdc,
        publicKey,
        slippageBps: slippageBps,
    });
    return response.data;
};