"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { GameProps } from "@/types/game";

interface HeartTileProps {
    index: number;
    isFlipped: boolean;
    isNo: boolean;
    onFlip: () => void;
    onYesClick: () => void;
}

const HeartTile: React.FC<HeartTileProps> = ({
    isFlipped,
    isNo,
    onFlip,
    onYesClick,
}) => {
    return (
        <motion.div
            className="relative w-full aspect-square cursor-pointer"
            style={{ perspective: "1000px" }}
            initial={{ opacity: 1, y: 0 }}
            exit={{
                y: -window.innerHeight * 2,
                opacity: 0,
                rotate: 360,
                scale: 0.5,
            }}
            transition={{ duration: 1, ease: "easeIn" }}
        >
            <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Front Face - Heart */}
                <div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl shadow-lg backface-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                    onClick={!isFlipped ? onFlip : undefined}
                >
                    <span className="text-4xl sm:text-5xl md:text-6xl">❤️</span>
                </div>

                {/* Back Face - Yes/No Button */}
                <div
                    className="absolute inset-0 flex items-center justify-center rounded-2xl shadow-lg backface-hidden"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    {isNo ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl">
                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">No</span>
                        </div>
                    ) : (
                        <button
                            onClick={onYesClick}
                            className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-2xl text-white text-xl sm:text-2xl md:text-3xl font-bold hover:scale-105 transition-transform"
                        >
                            Yes!
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export const FindNoButtonGame: React.FC<GameProps> = ({ name, onAccept }) => {
    const [flippedHearts, setFlippedHearts] = useState<Set<number>>(new Set());
    const [flyingAwayIndex, setFlyingAwayIndex] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Randomly assign the No button position (0-35) using lazy initializer
    const [noButtonIndex] = useState(() => Math.floor(Math.random() * 36));

    const handleFlip = (index: number) => {
        if (flippedHearts.has(index) || isAnimating) return;

        const newFlipped = new Set(flippedHearts);
        newFlipped.add(index);
        setFlippedHearts(newFlipped);

        // If this is the No button, trigger fly-away animation
        if (index === noButtonIndex) {
            setIsAnimating(true);
            setTimeout(() => {
                setFlyingAwayIndex(index);
                // Re-enable clicks after animation completes
                setTimeout(() => {
                    setIsAnimating(false);
                }, 1000);
            }, 600); // Wait for flip to complete
        }
    };

    const handleYesClick = () => {
        if (isAnimating) return;
        onAccept();
    };

    return (
        <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4 sm:gap-6 w-full max-w-4xl px-4">
                {/* Horizontal Header Layout */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                    <Image
                        src="/brown-bear-brown.gif"
                        alt="Cute Bear"
                        width={128}
                        height={128}
                        className="object-contain w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32"
                        priority
                    />
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {name}, will you be my Valentine?
                    </h1>
                </div>

                <div className="w-full max-w-2xl">
                    <div className="grid grid-cols-6 gap-2 md:gap-3">
                        {Array.from({ length: 36 }).map((_, index) => (
                            <div key={index} className="relative">
                                <AnimatePresence mode="wait">
                                    {flyingAwayIndex !== index && (
                                        <HeartTile
                                            index={index}
                                            isFlipped={flippedHearts.has(index)}
                                            isNo={index === noButtonIndex}
                                            onFlip={() => handleFlip(index)}
                                            onYesClick={handleYesClick}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-center text-base md:text-lg text-black/80 max-w-lg">
                    Find the one heart that says &quot;No&quot; to avoid accepting!&nbsp;💝
                </p>
            </div>
        </>
    );
};
