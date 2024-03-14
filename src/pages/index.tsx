import { CSSProperties, useEffect, useState } from "react";
import { Layout, Row, Col, Typography, Tooltip } from "antd/lib";
import {
    GithubOutlined,
    LinkedinOutlined,
    TwitterOutlined,
    DiscordOutlined,
} from "@ant-design/icons/lib";
import Chart from "../components/Chart";
import SwapInterface from "../components/SwapInterface";
import TransactionHistory from "../components/TransactionHistory";
import { v4 as uuidv4 } from "uuid";
const { Header, Content, Footer } = Layout;
const { Link } = Typography;
const { Title } = Typography;
import { useWindowSize } from "react-use";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type Transaction = {
    id: string;
    transactionHash: string;
    amountToBuyUsdc: number;
    slippage: number;
    status: "success" | "failed";
    timestamp: string;
    quote: {
        inAmount: string;
        slippageBps: number;
    };
};

export default function Home() {
    const { width } = useWindowSize();
    const isMobile = width < 1024;
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const handleSwapSuccess = (transaction: Transaction) => {
        const uuid = uuidv4();
        const newTransaction: Transaction = {
            id: uuid,
            transactionHash: transaction.transactionHash ?? uuid,
            amountToBuyUsdc: parseFloat(transaction.quote.inAmount) / 1e9,
            slippage: transaction.quote.slippageBps / 100,
            status: "success",
            timestamp: new Date().toLocaleString(),
            quote: transaction.quote,
        };
        setTransactions([...transactions, newTransaction]);
    };

    const headerStyle: CSSProperties = {
        padding: "0 24px",
        backgroundColor: "#232323",
        borderBottom: "1px solid #333333",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
    };

    const socialIconsStyle: CSSProperties = {
        display: "flex",
        flexDirection: "row" as const,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        position: "fixed",
        right: "32px",
        bottom: "12px",
        gap: "0.5rem",
        zIndex: 10,
    };

    const titleStyle: CSSProperties = {
        color: "#E0E0E0",
        margin: "0 16px",
        flexGrow: 1,
        fontFamily: '"Orbitron", sans-serif',
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        textShadow: "2px 2px 8px rgba(255, 255, 255, 0.6)",
    };
    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#1C1C1C" }}>
            <Header style={headerStyle}>
                <Title level={3} style={titleStyle}>
                    Edge
                </Title>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <WalletMultiButton />
                </div>
            </Header>

            <Content style={{ padding: "24px 48px", position: "relative" }}>
                <Row gutter={[24, 24]} justify="center">
                    <Col xs={24} lg={16}>
                        <Chart />
                    </Col>
                    <Col xs={24} lg={8}>
                        <SwapInterface onSwapSuccess={handleSwapSuccess} />
                    </Col>
                    <Col xs={24}>
                        <TransactionHistory transactions={transactions} />
                    </Col>
                </Row>
            </Content>
            {!isMobile && (
                <div style={socialIconsStyle}>
                    <Tooltip title="GitHub">
                        <a
                            href="https://github.com/lucas-low"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "20px", margin: "0 8px" }}
                        >
                            <GithubOutlined style={{ color: "#E0E0E0" }} />
                        </a>
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                        <a
                            href="https://linkedin.com/in/lucaslowyy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "20px", margin: "0 8px" }}
                        >
                            <LinkedinOutlined style={{ color: "#E0E0E0" }} />
                        </a>
                    </Tooltip>
                    <Tooltip title="Twitter">
                        <a
                            href="https://twitter.com/0xlucaslow"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "20px", margin: "0 8px" }}
                        >
                            <TwitterOutlined style={{ color: "#E0E0E0" }} />
                        </a>
                    </Tooltip>
                    <Tooltip title="Discord">
                        <a
                            href="https://discord.com/users/yourNumericDiscordID"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "20px", margin: "0 8px" }}
                        >
                            <DiscordOutlined style={{ color: "#E0E0E0" }} />
                        </a>
                    </Tooltip>
                </div>
            )}
        </Layout>
    );
}
