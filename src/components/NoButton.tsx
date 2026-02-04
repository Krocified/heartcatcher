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
            whileHover={level >= maxLevel ? { scale: 1.1 } : {}}
            whileTap={level >= maxLevel ? { scale: 0.95 } : {}}
            animate={{
                x: position.x,
                y: position.y,
                scale: level >= maxLevel ? 1 : Math.max(0.4, 1 - level * 0.08), // Revert to 1 at max level
                rotate: level >= maxLevel ? 0 : [0, -2, 2, -2, 0], // Stop shaking at max level
                opacity: level >= maxLevel ? 1 : Math.max(0.6, 1 - level * 0.04),
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                rotate: level >= maxLevel ? {} : {
                    repeat: Infinity,
                    duration: Math.max(0.1, 0.5 - level * 0.04),
                    ease: "easeInOut"
                }
            }}
            className={`px-8 py-4 border-2 border-primary text-primary text-2xl font-bold rounded-full transition-colors whitespace-nowrap ${level >= maxLevel ? "bg-primary text-white" : "bg-white/60 hover:bg-primary hover:text-white"
                }`}
        >
            {getNoButtonText()}
        </motion.button>
    );
});

NoButton.displayName = "NoButton";
