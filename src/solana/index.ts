import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { getConfig } from '../config';

const { solanaEndpoint, privateKey } = getConfig();
const connection = new Connection(solanaEndpoint);

let keypair: Keypair;
if (privateKey) {
  try {
    keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
  } catch (error) {
    console.error('Failed to parse private key:', error);
    console.warn('Private key not found in configuration. Using a default key for development only.');
    keypair = Keypair.generate(); 
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

export const getPublicKey = () => keypair.publicKey;