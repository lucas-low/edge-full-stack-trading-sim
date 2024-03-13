import React, { ReactNode } from "react";
import {
    WalletProvider,
    ConnectionProvider,
} from "@solana/wallet-adapter-react";
import {
    PhantomWalletAdapter,
    UnsafeBurnerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

const network = clusterApiUrl("mainnet-beta");
const wallets = [
    // new PhantomWalletAdapter(),
    new UnsafeBurnerWalletAdapter(),
];

const ClientWalletProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default ClientWalletProvider;
