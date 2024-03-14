// SlippageSettings.tsx
import React, { useState } from "react";
import { Popover, Button, InputNumber, Tooltip } from "antd/lib";
import { SettingOutlined, CloseOutlined } from "@ant-design/icons/lib";
import styles from "@/styles/SlippageSettings.module.css";

export interface SlippageSettingsProps {
    slippage: number;
    onSlippageChange: (slippage: number) => void;
}

const SlippageSettings: React.FC<SlippageSettingsProps> = ({
    slippage,
    onSlippageChange,
}) => {
    const [openPopover, setOpenPopover] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleOpenPopover = (open: boolean) => {
        setOpenPopover(open);
        setTooltipVisible(!open);
        if (open) {
            document.body.classList.add("backdrop.show");
        } else {
            document.body.classList.remove("backdrop.show");
        }
    };

    const handleSaveSettings = () => {
        localStorage.setItem("slippage", slippage.toString());
        handleClose();
    };

    const handleClose = () => {
        setOpenPopover(false);
        setTooltipVisible(false);
        document.body.classList.remove("backdrop.show");
    };

    const title = (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <span>Slippage Settings</span>
            <CloseOutlined
                style={{
                    color: "#E0E0E0",
                    cursor: "pointer",
                }}
                onClick={handleClose}
            />
        </div>
    );

    const content = (
        <div className={styles.slippagePopoverContent}>
            <Button
                className={styles.slippageButton}
                onClick={() => onSlippageChange(0.3)}
            >
                0.3%
            </Button>
            <Button
                className={styles.slippageButton}
                onClick={() => onSlippageChange(0.5)}
            >
                0.5%
            </Button>
            <Button
                className={styles.slippageButton}
                onClick={() => onSlippageChange(1)}
            >
                1%
            </Button>
            <InputNumber
                className={styles.inputNumber}
                min={0}
                max={5}
                value={slippage}
                onChange={(value) => value && onSlippageChange(value)}
                formatter={(value) => `${value}%`}
                parser={(value: string | undefined) =>
                    value ? parseFloat(value) : 0
                }
            />
            <Button
                className={styles.saveSettingsButton}
                onClick={handleSaveSettings}
            >
                Save Settings
            </Button>
        </div>
    );
    return (
        <>
            <div className={`backdrop ${openPopover ? "show" : ""}`}></div>
            <Popover
                content={content}
                title={title}
                trigger={[]}
                open={openPopover}
                onOpenChange={handleOpenPopover}
                overlayClassName="custom-slippage-popover"
            >
                <Tooltip
                    title="Slippage Settings"
                    open={!openPopover && tooltipVisible}
                    onOpenChange={setTooltipVisible}
                >
                    <SettingOutlined
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() => setOpenPopover(!openPopover)}
                    />
                    <span style={{ color: "white", marginLeft: "8px" }}>
                        {`${slippage}%`}
                    </span>
                </Tooltip>
            </Popover>
        </>
    );
};

export default SlippageSettings;
