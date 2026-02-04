"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeartDecoratorProps {
    level: number;
    maxLevel: number;
}

export const HeartDecorator: React.FC<HeartDecoratorProps> = ({ level, maxLevel }) => {
    return (
        <motion.div
            animate={{
                opacity: level / maxLevel,
                scale: 0.5 + (level / maxLevel)
            }}
            className="absolute top-4 right-4 text-4xl pointer-events-none"
        >
            💖
        </motion.div>
    );
};
