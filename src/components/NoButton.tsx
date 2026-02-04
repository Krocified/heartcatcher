"use client";

import React from "react";
import { motion } from "framer-motion";
import { NO_EXPRESSIONS } from "@/constants/expressions";

interface NoButtonProps {
    level: number;
    maxLevel: number;
    position: { x: number, y: number };
    onInteraction: () => void;
    onClick: () => void;
}

export const NoButton = React.forwardRef<HTMLButtonElement, NoButtonProps>(({
    level,
    maxLevel,
    position,
    onInteraction,
    onClick,
}, ref) => {
    const getNoButtonText = () => {
        return NO_EXPRESSIONS[Math.min(level, NO_EXPRESSIONS.length - 1)];
    };

    return (
        <motion.button
            ref={ref}
            onMouseEnter={onInteraction}
            onTouchStart={(e) => {
                e.preventDefault(); // Prevent accidental selection
                onInteraction();
            }}
            onClick={onClick}
            animate={{
                x: position.x,
                y: position.y,
                scale: Math.max(0.4, 1 - level * 0.08),
                rotate: level >= 7 ? [0, -5, 5, 0] : 0,
                opacity: level === 8 ? [1, 0.3, 1] : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                rotate: { duration: 0.1, repeat: level >= 7 ? Infinity : 0 },
                opacity: { duration: 0.3, repeat: level === 8 ? Infinity : 0 }
            }}
            className={`px-8 py-4 border-2 border-primary text-primary text-2xl font-bold rounded-full transition-colors whitespace-nowrap ${level >= maxLevel ? "bg-primary text-white" : "bg-white/60 hover:bg-primary hover:text-white"
                }`}
        >
            {getNoButtonText()}
        </motion.button>
    );
});

NoButton.displayName = "NoButton";
