import { SetStateAction, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Input,
    message,
    Row,
    Typography,
} from "antd/lib";
import {
    SwapOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
} from "@ant-design/icons/lib";
import { useWallet } from "@solana/wallet-adapter-react";
import { swap } from "@/utils/api";
import SlippageSettings from "../SlippageSettings";

const { Title } = Typography;

type Props = {
    onSwapSuccess: (transaction: any) => void;
};

export default function SwapInterface({ onSwapSuccess }: Props) {
    const [amountToBuyUsdc, setAmountToBuyUsdc] = useState("");
    const [slippage, setSlippage] = useState(1);
    const [swapStatus, setSwapStatus] = useState("idle");
    const [swapError, setSwapError] = useState("");

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
            const slippageBps = slippage * 100;
            const transaction = await swap(
                parseFloat(amountToBuyUsdc),
                wallet.publicKey.toBase58(),
                slippageBps
            );
            setSwapStatus("success");
            onSwapSuccess(transaction);
            message.success("Swap successful!");
        } catch (error) {
            if (error instanceof Error) {
                setSwapStatus("failed");
                setSwapError(error.message);
                message.error(error.message);
            } else {
                console.error("An unknown error occurred:", error);
                setSwapStatus("failed");
                setSwapError("An unknown error occurred");
                message.error("An unknown error occurred");
            }
        }
    };

    const handleSlippageChange = (newSlippage: SetStateAction<number>) => {
        setSlippage(newSlippage);
    };

    return (
        <>
            <SlippageSettings
                slippage={slippage}
                onSlippageChange={handleSlippageChange}
            />
            <Card
                style={{
                    backgroundColor: "#3C3C3C",
                    borderRadius: 8,
                    border: "none",
                    marginTop: "16px",
                }}
            >
                <Title level={4} style={{ color: "#E0E0E0" }}>
                    Simulate USDC/JUP Swap
                </Title>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Input
                            type="number"
                            value={amountToBuyUsdc}
                            onChange={(e) => setAmountToBuyUsdc(e.target.value)}
                            placeholder="Amount to Buy (USDC)"
                            size="large"
                            className="input-grey-placeholder"
                            style={{
                                backgroundColor: "#2C2C2C",
                                color: "#E0E0E0",
                            }}
                        />
                    </Col>
                    <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                    ></Col>
                    {/* <Col span={24}>
                    <Input
                        type="number"
                        value={slippage}
                        onChange={(e) =>
                            setSlippage(parseFloat(e.target.value))
                        }
                        placeholder="Slippage Tolerance (%)"
                        size="large"
                        className="input-grey-placeholder"
                        style={{ backgroundColor: "#2C2C2C", color: "#E0E0E0" }}
                    />
                </Col> */}
                    <Col span={24}>
                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handleSwap}
                            disabled={swapStatus === "pending"}
                            style={{
                                backgroundColor: "#805AD5",
                                borderColor: "#805AD5",
                            }}
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
        </>
    );
}
