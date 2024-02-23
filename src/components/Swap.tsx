import { useState } from "react";

export const SwapComponent = () => {
    const [amountToBuyUSDC, setAmountToBuyUSDC] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleSwap = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/swap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amountToBuyUSDC }),
            });

            if (!response.ok) {
                throw new Error("Swap API call failed");
            }

            const data = await response.json();
            setResult(JSON.stringify(data, null, 2));
        } catch (error: any) {
            console.error(error.message);
            setResult("Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={amountToBuyUSDC}
                onChange={(e) => setAmountToBuyUSDC(e.target.value)}
                placeholder="Amount in USDC"
            />
            <button onClick={handleSwap} disabled={isLoading}>
                Perform Swap
            </button>
            <pre>{result}</pre>
        </div>
    );
};
