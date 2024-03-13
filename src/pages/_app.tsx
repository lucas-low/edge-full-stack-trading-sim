import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "@solana/wallet-adapter-react-ui/styles.css";
import { QueryClient, QueryClientProvider } from "react-query";

const WalletProvider = dynamic(() => import("../contexts/WalletProvider"), {
    ssr: false,
});
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    return (
        <WalletProvider>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </WalletProvider>
    );
}
