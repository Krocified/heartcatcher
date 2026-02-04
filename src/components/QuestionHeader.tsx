"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionHeaderProps {
    name: string;
    level: number;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({ name, level }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={level}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-center mb-12"
            >
                <div className="text-6xl mb-4">💝</div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-4">
                    {name}, will you be my Valentine?
                </h1>
            </motion.div>
        </AnimatePresence>
    );
};
