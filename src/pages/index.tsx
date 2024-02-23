import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

export default function Home() {
    const [simulationResult, setSimulationResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const runSimulation = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/simulate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setSimulationResult(result.output);
            } else {
                setSimulationResult("Simulation failed to complete.");
            }
        } catch (error) {
            setSimulationResult(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Simulation Showcase</title>
                <meta
                    name="description"
                    content="Displaying Simulation Results"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Trading Simulator with Jupiter Aggregator
                </h1>
                <button onClick={runSimulation} disabled={isLoading}>
                    <p>Run Simulation</p>
                </button>
                {isLoading ? (
                    <div className="w-10 h-10 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                ) : (
                    <pre>{simulationResult}</pre>
                )}
            </main>
        </>
    );
}
