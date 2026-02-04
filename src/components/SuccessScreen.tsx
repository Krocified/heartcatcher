"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface SuccessScreenProps {
    name: string;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ name }) => {
    useEffect(() => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-8"
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl"
            >
                ❤️
            </motion.div>
            <h1 className="text-5xl font-bold text-primary drop-shadow-lg px-4">
                Yay! See you on the 14th, {name}! 🥰
            </h1>
            <p className="text-xl text-secondary">You made me the luckiest person!</p>
        </motion.div>
    );
};
