"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { NO_EXPRESSIONS } from "@/constants/expressions";

export const HeartCatcher = () => {
    const [level, setLevel] = useState(0);
    const [accepted, setAccepted] = useState(false);
    const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const name = process.env.NEXT_PUBLIC_VALENTINE_NAME || "Valentine";
    const MAX_LEVEL = 10;

    const handleNoInteraction = () => {
        if (level >= MAX_LEVEL) return;

        const nextLevel = level + 1;
        setLevel(nextLevel);

        // Dynamic Evasion Logic for 10 Levels
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const padding = 120;

            let newX = 0;
            let newY = 0;

            if (nextLevel < 3) {
                // Levels 1-2: Simple slides
                newX = (nextLevel === 1 ? 40 : -60);
                newY = (nextLevel === 1 ? -20 : 30);
            } else {
                // Levels 3-9: Randomized jumps within bounds
                const boundsX = (rect.width - padding) / 2;
                const boundsY = (rect.height - padding) / 2;

                // Ensure it doesn't just jump to the exact same spot
                newX = (Math.random() - 0.5) * boundsX * 2;
                newY = (Math.random() - 0.5) * boundsY * 2;
            }

            setNoButtonPos({ x: newX, y: newY });
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
        return NO_EXPRESSIONS[Math.min(level, NO_EXPRESSIONS.length - 1)];
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
                <h1 className="text-5xl font-bold text-primary drop-shadow-lg px-4">
                    Yay! See you on the 14th, {name}! 🥰
                </h1>
                <p className="text-xl text-secondary">You made me the luckiest person!</p>
            </motion.div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col items-center justify-center min-h-[70vh] w-full max-w-4xl p-8 rounded-3xl bg-white/30 backdrop-blur-md border border-white/50 shadow-2xl overflow-hidden select-none"
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
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-4">
                        {name}, will you be my Valentine?
                    </h1>
                </motion.div>
            </AnimatePresence>

            <div className="relative flex flex-wrap items-center justify-center gap-8 min-h-[300px] w-full">
                {/* YES BUTTON */}
                <motion.button
                    onClick={handleYesClick}
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

                {/* NO BUTTON */}
                <motion.button
                    onMouseEnter={handleNoInteraction}
                    onTouchStart={(e) => {
                        e.preventDefault(); // Prevent accidental selection
                        handleNoInteraction();
                    }}
                    onClick={level >= MAX_LEVEL ? handleYesClick : (e) => {
                        // Action of clicking it if it somehow gets clicked
                        handleNoInteraction();
                    }}
                    animate={{
                        x: noButtonPos.x,
                        y: noButtonPos.y,
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
                    className={`px-8 py-4 border-2 border-primary text-primary text-2xl font-bold rounded-full transition-colors whitespace-nowrap ${level >= MAX_LEVEL ? "bg-primary text-white" : "bg-white/60 hover:bg-primary hover:text-white"
                        }`}
                >
                    {getNoButtonText()}
                </motion.button>
            </div>

            {/* Heart decoration that follows level */}
            <motion.div
                animate={{
                    opacity: level / MAX_LEVEL,
                    scale: 0.5 + (level / MAX_LEVEL)
                }}
                className="absolute top-4 right-4 text-4xl pointer-events-none"
            >
                💖
            </motion.div>
        </div>
    );
};
