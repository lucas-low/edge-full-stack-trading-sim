export type Quote = {
    inputMint: string;
    outputMint: string;
    inputAmount: number;
    outputAmount: number;
    price: number;
    fee: number;
  };
  
  export type TradingStrategy = (quote: Quote) => Promise<boolean>;