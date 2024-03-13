import { useState } from "react";
import { Layout, Row, Col } from "antd/lib";
import Chart from "../components/Chart";
import SwapInterface from "../components/SwapInterface";
import TransactionHistory from "../components/TransactionHistory";

const { Header, Content } = Layout;

export default function Home() {
    const [transactions, setTransactions] = useState([]);

    const handleSwapSuccess = (transaction: any) => {
        const newTransaction: Transaction = {
            id: transaction.id,
            transactionHash: transaction.transactionHash,
            amountToBuyUsdc: transaction.amountToBuyUsdc,
            slippage: transaction.slippage,
            status: transaction.status,
            timestamp: new Date().toLocaleString(),
        };
        setTransactions([...transactions, newTransaction]);
    };

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#1e1e1e" }}>
            <Header
                style={{
                    backgroundColor: "#141414",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h1 style={{ color: "#ffffff", margin: 0 }}>JUP/USDC Swap</h1>
            </Header>
            <Content style={{ padding: "24px 48px" }}>
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
        </Layout>
    );
}
