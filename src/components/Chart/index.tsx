import { useEffect, useState } from "react";
import { Card } from "antd/lib";
import { getOhlcData } from "../../utils/api";
import dynamic from "next/dynamic";

const TradingViewChart = dynamic(() => import("../TradingViewChart"), {
    ssr: false,
});

export default function Chart() {
    const [ohlcData, setOhlcData] = useState([]);

    useEffect(() => {
        const fetchOhlcData = async () => {
            const data = await getOhlcData();
            setOhlcData(data);
        };

        fetchOhlcData();
    }, []);

    return (
        <Card
            style={{
                backgroundColor: "#141414",
                borderRadius: 8,
                height: "100%",
            }}
        >
            <div style={{ height: "400px" }}>
                <TradingViewChart ohlcData={ohlcData} />
            </div>
        </Card>
    );
}
