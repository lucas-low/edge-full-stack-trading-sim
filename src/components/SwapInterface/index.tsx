import { SetStateAction, useState } from "react";
import { Alert, Button, Card, Col, Input, Row, Typography } from "antd/lib";
import {
    SwapOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
} from "@ant-design/icons/lib";
import { useWallet } from "@solana/wallet-adapter-react";
import { swap } from "@/utils/api";
import SlippageSettings from "../SlippageSettings";
import { toast } from "react-toastify";

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
            toast.error("Please enter an amount to swap.");
            return;
        }

        if (!wallet.publicKey) {
            toast.error("Please connect your wallet.");
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
            if (transaction && transaction.success) {
                setSwapStatus("success");
                onSwapSuccess(transaction);
                toast.success("Swap successful!");
            } else {
                throw new Error("Swap transaction failed");
            }
        } catch (error) {
            setSwapStatus("failed");
            let errorMessage = "An unknown error occurred";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                console.error("An unknown error occurred:", error);
            }
            setSwapError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleSlippageChange = (newSlippage: SetStateAction<number>) => {
        setSlippage(newSlippage);
    };

    return (
        <>
            <Card
                style={{
                    backgroundColor: "#3C3C3C",
                    borderRadius: 8,
                    border: "none",
                    marginTop: "16px",
                }}
            >
                <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                    <Col span={24}>
                        <SlippageSettings
                            slippage={slippage}
                            onSlippageChange={handleSlippageChange}
                        />
                    </Col>
                </Row>
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
                                borderRadius: "12px",
                            }}
                        />
                    </Col>
                    <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                    ></Col>
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
                                borderRadius: "12px",
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
