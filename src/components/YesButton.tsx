"use client";

import React from "react";
import { motion } from "framer-motion";

interface YesButtonProps {
    level: number;
    onClick: () => void;
}

export const YesButton: React.FC<YesButtonProps> = ({ level, onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
                scale: 1 + level * 0.15, // Grows faster over 10 levels
                boxShadow: level > 5 ? "0 0 30px rgba(255, 77, 109, 0.6)" : "none"
            }}
            className="px-8 py-4 bg-primary text-white text-2xl font-bold rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10"
        >
            Yes!
        </motion.button>
    );
};
