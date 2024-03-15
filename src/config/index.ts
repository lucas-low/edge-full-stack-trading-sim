const CONFIG = {
    solanaEndpoint: process.env.NEXT_PUBLIC_SOLANA_ENDPOINT || 'https://api.mainnet-beta.solana.com',
    jupiterEndpoint: process.env.NEXT_PUBLIC_JUPITER_ENDPOINT || 'https://api.jup.ag/v3',
    privateKey: process.env.PRIVATE_KEY,
    tradingStrategy: process.env.NEXT_PUBLIC_TRADING_STRATEGY || 'default',
    logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
  };
  
  export const getConfig = () => CONFIG;