import { Card, Table, Typography, Tag, Tooltip } from "antd/lib";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons/lib";
import { useWindowSize } from "react-use";
import { useEffect, useState } from "react";
const { Title } = Typography;

type Transaction = {
    id: string;
    transactionHash: string;
    amountToBuyUsdc: number;
    slippage: number;
    status: "success" | "failed";
    timestamp: string;
    routePlan: Route[];
    quote: {
        routePlan: Route[];
    };
};

type TablePaginationPosition =
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight";

const darkModeStyles = {
    card: {
        backgroundColor: "#1e1e1e",
        borderRadius: "8px",
        border: "none",
        color: "#ffffff",
    },
    table: {
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
    },
    row: {
        borderBottom: "1px solid #333",
    },
    link: {
        color: "#58a6ff",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    noDataText: {
        color: "#ffffff",
    },
};

const expandedRowRender = (record: Transaction) => {
    const routePlan = record.quote?.routePlan;
    if (!routePlan || routePlan.length === 0) {
        return <p style={darkModeStyles.noDataText}>No route plan available</p>;
    }

    return (
        <div>
            {routePlan.map((route, index) => (
                <p key={index} style={darkModeStyles.table}>
                    {route.swapInfo.label}:{" "}
                    <span style={{ fontWeight: "bold" }}>{route.percent}%</span>{" "}
                    - In Amount:
                    {route.swapInfo.inAmount} - Out Amount:{" "}
                    {route.swapInfo.outAmount}
                </p>
            ))}
        </div>
    );
};

export default function TransactionHistory({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const { height } = useWindowSize();
    const [tableMaxHeight, setTableMaxHeight] = useState("500px");
    const [tableMinHeight, setTableMinHeight] = useState("500px");

    useEffect(() => {
        const rowHeight = 50;
        const minRowsToShow = 10;
        const calculateHeight = () => {
            const headerHeight = 60;
            const footerHeight = 60;
            const pageMargin = 48;
            const otherComponentsHeight = 150;
            const availableHeight =
                height -
                (headerHeight +
                    footerHeight +
                    pageMargin +
                    otherComponentsHeight);

            const minHeight = Math.max(300, minRowsToShow * rowHeight);
            const maxHeight = Math.max(minHeight, availableHeight);

            setTableMinHeight(`${minHeight}px`);
            setTableMaxHeight(`${maxHeight}px`);
        };

        calculateHeight();

        window.addEventListener("resize", calculateHeight);

        return () => window.removeEventListener("resize", calculateHeight);
    }, [height]);

    const columns = [
        {
            title: "Transaction Hash",
            dataIndex: "transactionHash",
            key: "transactionHash",
            render: (transactionHash: string) => (
                <a
                    href={`https://solscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {transactionHash
                        ? transactionHash.slice(0, 8) + "..."
                        : "-"}
                </a>
            ),
        },
        {
            title: "Amount (USDC)",
            dataIndex: "amountToBuyUsdc",
            key: "amountToBuyUsdc",
        },
        {
            title: "Slippage",
            dataIndex: "slippage",
            key: "slippage",
            render: (slippage: number) => `${slippage}%`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: "success" | "failed") => (
                <Tag
                    icon={
                        status === "success" ? (
                            <CheckCircleOutlined />
                        ) : (
                            <CloseCircleOutlined />
                        )
                    }
                    color={status === "success" ? "success" : "error"}
                >
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
        },
    ];
    const paginationConfig = {
        pageSize: 10,
        position: ["bottomCenter"] as TablePaginationPosition[],
    };
    return (
        <Card
            style={{
                marginTop: 16,
                backgroundColor: "#1e1e1e",
                borderRadius: 8,
                border: "none",
            }}
        >
            {transactions.length > 0 ? (
                <Table
                    dataSource={transactions}
                    columns={columns}
                    rowKey="id"
                    pagination={paginationConfig}
                    style={{
                        backgroundColor: "#1e1e1e",
                        maxHeight: tableMaxHeight,
                        minHeight: tableMinHeight,
                        overflow: "auto",
                    }}
                    rowClassName={() => "transaction-row"}
                    className="custom-pagination-table"
                    size="middle"
                    expandable={{
                        expandedRowRender,
                        expandRowByClick: true,
                        expandedRowClassName: () => "expanded-row-style",
                        rowExpandable: (record) =>
                            record.name !== "Not Expandable",
                    }}
                />
            ) : (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "16px 0",
                    }}
                >
                    <p style={{ color: "#ffffff" }}>No transactions yet</p>
                </div>
            )}
        </Card>
    );
}
