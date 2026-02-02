"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import confetti from "canvas-confetti";

export const HeartCatcher = () => {
    const [level, setLevel] = useState(0);
    const [accepted, setAccepted] = useState(false);
    const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const handleNoHover = () => {
        if (level >= 5) return; // Logic theft already happened or max level reached

        const nextLevel = level + 1;
        setLevel(nextLevel);

        // Progressive Evasion Logic
        if (nextLevel === 1) {
            // Small hop
            setNoButtonPos({ x: 50, y: -20 });
        } else if (nextLevel >= 2 && nextLevel < 5) {
            // Random jump within container
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const padding = 100;
                const newX = (Math.random() - 0.5) * (rect.width - padding);
                const newY = (Math.random() - 0.5) * (rect.height - padding);
                setNoButtonPos({ x: newX, y: newY });
            }
        }
    };

    const handleYesClick = () => {
        setAccepted(true);
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const getNoButtonText = () => {
        if (level >= 5) return "Yes! ❤️";
        const expressions = ["No", "Are you sure?", "Think again!", "Pwease?", "Wait...", "No way!"];
        return expressions[Math.min(level, expressions.length - 1)];
    };

    if (accepted) {
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
                <h1 className="text-5xl font-bold text-primary drop-shadow-lg">
                    Yay! See you on the 14th! 🥰
                </h1>
                <p className="text-xl text-secondary">You made me the luckiest person!</p>
            </motion.div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col items-center justify-center min-h-[60vh] w-full max-w-4xl p-8 rounded-3xl bg-white/30 backdrop-blur-md border border-white/50 shadow-2xl overflow-hidden"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={level}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-6xl mb-4">💝</div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Will you be my Valentine?
                    </h1>
                </motion.div>
            </AnimatePresence>

            <div className="relative flex flex-wrap items-center justify-center gap-8 min-h-[200px] w-full">
                {/* YES BUTTON */}
                <motion.button
                    onClick={handleYesClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                        scale: 1 + level * 0.1,
                        boxShadow: level > 3 ? "0 0 20px rgba(255, 77, 109, 0.5)" : "none"
                    }}
                    className="px-8 py-4 bg-primary text-white text-2xl font-bold rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10"
                >
                    Yes!
                </motion.button>

                {/* NO BUTTON */}
                <motion.button
                    onMouseEnter={handleNoHover}
                    onClick={level >= 5 ? handleYesClick : undefined}
                    animate={{
                        x: noButtonPos.x,
                        y: noButtonPos.y,
                        scale: Math.max(0.5, 1 - level * 0.1),
                        opacity: level === 4 ? [1, 0.5, 1] : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        opacity: { duration: 0.2, repeat: level === 4 ? Infinity : 0 }
                    }}
                    className={`px-8 py-4 border-2 border-primary text-primary text-2xl font-bold rounded-full transition-colors ${level >= 5 ? "bg-primary text-white" : "bg-white/50 hover:bg-primary hover:text-white"
                        }`}
                >
                    {getNoButtonText()}
                </motion.button>
            </div>

            {level > 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-8 text-secondary font-medium italic"
                >
                    Difficulty Level: {level}
                </motion.p>
            )}
        </div>
    );
};
