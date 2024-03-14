import { Card, Table, Typography, Tag } from "antd/lib";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons/lib";

const { Title } = Typography;

type Transaction = {
    id: string;
    transactionHash: string;
    amountToBuyUsdc: number;
    slippage: number;
    status: "success" | "failed";
    timestamp: string;
};

type Props = {
    transactions: Transaction[];
};

export default function TransactionHistory({ transactions }: Props) {
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

    return (
        <Card
            style={{
                marginTop: 16,
                backgroundColor: "#1e1e1e",
                borderRadius: 8,
                border: "none",
            }}
        >
            {/* <Title level={4} style={{ color: "#ffffff" }}>
                Transaction History
            </Title> */}
            {transactions.length > 0 ? (
                <Table
                    dataSource={transactions}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    style={{
                        backgroundColor: "#1e1e1e",
                        maxHeight: "300px",
                        overflow: "auto",
                    }}
                    rowClassName={() => "transaction-row"}
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
