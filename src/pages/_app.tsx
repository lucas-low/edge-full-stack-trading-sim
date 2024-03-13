import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "@solana/wallet-adapter-react-ui/styles.css";

const WalletProvider = dynamic(() => import("../contexts/WalletProvider"), {
    ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <WalletProvider>
            <Component {...pageProps} />
        </WalletProvider>
    );
}
