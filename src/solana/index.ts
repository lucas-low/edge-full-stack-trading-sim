import { Connection, Keypair, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { getConfig } from '../config';

const { privateKey } = getConfig();

const  solanaEndpoint= clusterApiUrl("mainnet-beta")
const connection = new Connection(solanaEndpoint);

let keypair: Keypair;
if (privateKey) {
  try {
    keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
  } catch (error) {
    console.error('Failed to parse private key:', error);
    console.warn('Private key not found in configuration. Using a default key for development only.');
    keypair = Keypair.generate(); 
    console.warn('Public key:', keypair.publicKey.toString());
  }
} else {
  console.warn('Private key not found in configuration. Using a default key for development only.');
  keypair = Keypair.generate(); 
}

export const sendTransaction = async (transaction: Transaction): Promise<string> => {
  try {
    transaction.feePayer = keypair.publicKey;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.sign(keypair);

    const txid = await connection.sendRawTransaction(transaction.serialize());
    await connection.confirmTransaction(txid);

    return txid;
  } catch (error) {
    throw new Error(`Failed to send transaction: ${error.message}`);
  }
};
export const getBalance = async (publicKey: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error: any) {
    if (error.message.includes('403')) {
      throw new Error(`Access forbidden: ${error.message}. Check your RPC endpoint configuration or contact support.`);
    } else {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }
};

export const getPublicKey = () => keypair.publicKey;