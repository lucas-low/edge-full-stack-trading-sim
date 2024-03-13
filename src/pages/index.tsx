import { useState } from "react";
import axios from "axios";
import {
    Alert,
    Button,
    Card,
    Col,
    Input,
    message,
    Row,
    Tabs,
    Typography,
} from "antd/lib";
import {
    SwapOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
} from "@ant-design/icons/lib";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

const { Title } = Typography;
// const { TabPane } = Tabs;

export default function Home() {
    const [amountToBuyUsdc, setAmountToBuyUsdc] = useState("");
    const [slippage, setSlippage] = useState(1);
    const [swapStatus, setSwapStatus] = useState("idle");
    const [transactionHash, setTransactionHash] = useState("");
    const [swapError, setSwapError] = useState("");
    const [price, setPrice] = useState<number | null>(null);
    const [priceWithSlippage, setPriceWithSlippage] = useState<number | null>(
        null
    );
    const [routePlan, setRoutePlan] = useState([]);
    const wallet = useWallet();

    const handleSwap = async () => {
        if (!amountToBuyUsdc) {
            message.error("Please enter an amount to swap.");
            return;
        }

        if (!wallet.publicKey) {
            message.error("Please connect your wallet.");
            return;
        }

        setSwapStatus("pending");
        try {
            const quoteResponse = await axios.post("/api/swap", {
                amountToBuyUsdc: parseFloat(amountToBuyUsdc),
                publicKey: wallet.publicKey.toBase58(),
                slippage,
            });

            const txid = "simulated-txid";
            setSwapStatus("success");
            setTransactionHash(txid);
            const quote = quoteResponse.data.quote;
            setPrice(quote.inAmount / quote.outAmount);
            setPriceWithSlippage(quote.inAmount / quote.otherAmountThreshold);
            setRoutePlan(quote.routePlan);
            message.success("Swap successful!");
        } catch (error) {
            let errorMessage = "An error occurred while processing the swap.";
            if (axios.isAxiosError(error)) {
                const responseError = error.response;
                if (
                    responseError &&
                    responseError.data &&
                    "error" in responseError.data
                ) {
                    errorMessage = responseError.data.error;
                } else if (
                    responseError &&
                    responseError.data &&
                    typeof responseError.data === "string"
                ) {
                    errorMessage = responseError.data;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setSwapStatus("failed");
            setSwapError(errorMessage);
            message.error(errorMessage);
        }
    };

    return (
        <div
            style={{
                background: "#f0f2f5",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card
                style={{
                    width: 400,
                    background: "#16213e",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={3} style={{ color: "#fff", textAlign: "center" }}>
                    Simulate USDC/JUP swap
                </Title>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Input
                            type="number"
                            value={amountToBuyUsdc}
                            onChange={(e) => setAmountToBuyUsdc(e.target.value)}
                            placeholder="Amount to buy in USDC"
                            size="large"
                        />
                    </Col>
                    <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <WalletMultiButton />
                    </Col>
                    <Col span={24}>
                        <Input
                            type="number"
                            value={slippage}
                            onChange={(e) =>
                                setSlippage(parseFloat(e.target.value))
                            }
                            placeholder="Slippage Tolerance (%)"
                            size="large"
                        />
                    </Col>
                    <Col span={24}>
                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handleSwap}
                            disabled={swapStatus === "pending"}
                        >
                            {swapStatus === "pending" ? (
                                <LoadingOutlined spin />
                            ) : (
                                <SwapOutlined />
                            )}{" "}
                            Swap
                        </Button>
                    </Col>
                    {swapStatus === "success" && (
                        <Col span={24}>
                            <Alert
                                message="Swap Successful"
                                // description={
                                //     <div>
                                //         <Typography.Text>
                                //             Transaction Hash: {transactionHash}
                                //         </Typography.Text>
                                //         <br />
                                //         <Typography.Text>
                                //             Price: {price}
                                //         </Typography.Text>
                                //         <br />
                                //         <Typography.Text>
                                //             Price with Slippage:{" "}
                                //             {priceWithSlippage}
                                //         </Typography.Text>
                                //         <br />
                                //         <Typography.Text>
                                //             Route Plan:
                                //         </Typography.Text>
                                //         <ol>
                                //             {routePlan.map(
                                //                 (routeStep, index) => (
                                //                     <li key={index}>
                                //                         <Typography.Text>
                                //                             {
                                //                                 routeStep
                                //                                     .swapInfo
                                //                                     .label
                                //                             }{" "}
                                //                             ({routeStep.percent}
                                //                             %)
                                //                         </Typography.Text>
                                //                         <br />
                                //                         <Typography.Text>
                                //                             Input:{" "}
                                //                             {
                                //                                 routeStep
                                //                                     .swapInfo
                                //                                     .inAmount
                                //                             }{" "}
                                //                             {
                                //                                 routeStep
                                //                                     .swapInfo
                                //                                     .inputMint
                                //                             }
                                //                         </Typography.Text>
                                //                         <br />
                                //                         <Typography.Text>
                                //                             Output:{" "}
                                //                             {
                                //                                 routeStep
                                //                                     .swapInfo
                                //                                     .outAmount
                                //                             }{" "}
                                //                             {
                                //                                 routeStep
                                //                                     .swapInfo
                                //                                     .outputMint
                                //                             }
                                //                         </Typography.Text>
                                //                     </li>
                                //                 )
                                //             )}
                                //         </ol>
                                //         <br />
                                //         {/* <a
                                //             href={`https://solscan.io/tx/${transactionHash}`}
                                //             target="_blank"
                                //             rel="noopener noreferrer"
                                //         >
                                //             View on Solscan
                                //         </a> */}
                                //     </div>
                                // }
                                type="success"
                                showIcon
                                icon={<CheckCircleOutlined />}
                            />
                        </Col>
                    )}
                    {swapStatus === "failed" && (
                        <Col span={24}>
                            <Alert
                                message="Swap Failed"
                                description={swapError}
                                type="error"
                                showIcon
                                icon={<CloseCircleOutlined />}
                            />
                        </Col>
                    )}
                </Row>
            </Card>
        </div>
    );
}
