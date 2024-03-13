import { useEffect, useRef } from "react";

declare const TradingView: any;

type Props = {
    ohlcData: number[][];
};

export default function TradingViewChart({ ohlcData }: Props) {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => {
            if (typeof TradingView !== "undefined") {
                new TradingView.widget({
                    autosize: true,
                    symbol: "JUPUSDC",
                    interval: "5",
                    timezone: "Etc/UTC",
                    theme: "dark",
                    style: "1",
                    locale: "en",
                    toolbar_bg: "#f1f3f6",
                    enable_publishing: false,
                    allow_symbol_change: true,
                    container_id: chartContainerRef.current?.id || "",
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return (
        <div
            id="tradingview_chart_container"
            ref={chartContainerRef}
            style={{ position: "relative", width: "100%", height: "100%" }}
        />
    );
}
