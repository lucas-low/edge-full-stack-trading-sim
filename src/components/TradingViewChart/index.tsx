import { useEffect, useRef } from "react";

declare const TradingView: any;

export default function TradingViewChart() {
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
                    toolbar_bg: "#1C1C1C",
                    enable_publishing: false,
                    allow_symbol_change: false,
                    container_id: chartContainerRef.current?.id || "",
                    drawings_access: {
                        type: "black",
                        tools: [{ name: "Regression Trend" }],
                    },
                    disabled_features: [
                        "header_symbol_search",
                        "symbol_search_hot_key",
                        "header_screenshot",
                        "header_compare",
                        "display_market_status",
                        "study_templates",
                        "left_toolbar",
                        "control_bar",
                        "main_series_scale_menu",
                        "symbol_info",
                        "show_hide_button_in_legend",
                        "pane_context_menu",
                        "main_series_scale_menu",
                        "keyboard_shortcuts",
                    ],
                    overrides: {
                        "paneProperties.background": "#1C1C1C",
                        "paneProperties.vertGridProperties.color": "#232323",
                        "paneProperties.horzGridProperties.color": "#232323",
                        "scalesProperties.textColor": "#E0E0E0",
                    },
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <div
            id="tradingview_chart_container"
            ref={chartContainerRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
            }}
        />
    );
}
