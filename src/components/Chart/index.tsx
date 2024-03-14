import { useEffect } from "react";
import { Card } from "antd/lib";
import { useQuery } from "react-query";
import { getOhlcData } from "../../utils/api";
import dynamic from "next/dynamic";

const TradingViewChart = dynamic(() => import("../TradingViewChart"), {
    ssr: false,
});

export default function Chart() {
    const {
        data: ohlcData,
        isLoading,
        isError,
    } = useQuery("ohlcData", getOhlcData, {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff delay between retries, capped at 30 seconds
        staleTime: 60000,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching OHLC data. Please try again later.</div>;
    }

    return (
        <Card
            style={{
                backgroundColor: "#141414",
                borderRadius: 8,
                height: "100%",
                border: "none",
            }}
        >
            <div style={{ height: "400px" }}>
                <TradingViewChart ohlcData={ohlcData} />
            </div>
        </Card>
    );
}
