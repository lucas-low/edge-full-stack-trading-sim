import { useState } from "react";
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
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { swap } from "@/utils/api";

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
            const transaction = await swap(
                parseFloat(amountToBuyUsdc),
                wallet.publicKey.toBase58(),
                slippage
            );
            setSwapStatus("success");
            onSwapSuccess(transaction);
            message.success("Swap successful!");
        } catch (error) {
            setSwapStatus("failed");
            setSwapError(error.message);
            message.error(error.message);
        }
    };

    return (
        <Card>
            <Title level={3}>Simulate USDC/JUP swap</Title>
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
    );
}
