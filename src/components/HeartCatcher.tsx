"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { SuccessScreen } from "./SuccessScreen";
import { QuestionHeader } from "./QuestionHeader";
import { YesButton } from "./YesButton";
import { NoButton } from "./NoButton";
import { HeartDecorator } from "./HeartDecorator";

export const HeartCatcher = () => {
    const [level, setLevel] = useState(0);
    const [accepted, setAccepted] = useState(false);

    // Position state for NoButton (absolute coordinates)
    const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
    const [isInitialized, setIsInitialized] = useState(false);

    const noButtonRef = useRef<HTMLButtonElement>(null);
    const avoidanceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const posRef = useRef({ x: 0, y: 0 });

    const name = process.env.NEXT_PUBLIC_VALENTINE_NAME || "Valentine";
    const MAX_LEVEL = 10;

    // Initialize position to be somewhat central but offset from Yes button
    useEffect(() => {
        if (typeof window !== "undefined") {
            const initialX = window.innerWidth * 0.6;
            const initialY = window.innerHeight * 0.5;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setNoButtonPos({ x: initialX, y: initialY });
            posRef.current = { x: initialX, y: initialY };
            setIsInitialized(true);
        }
    }, []);

    const handleNoInteraction = useCallback(() => {
        if (level >= MAX_LEVEL) return;
        setLevel(prev => Math.min(prev + 1, MAX_LEVEL));
    }, [level, MAX_LEVEL]);

    const startTicking = useCallback(() => {
        if (avoidanceTimerRef.current) return;
        avoidanceTimerRef.current = setInterval(() => {
            handleNoInteraction();
        }, 2000);
    }, [handleNoInteraction]);

    const stopTicking = useCallback(() => {
        if (avoidanceTimerRef.current) {
            clearInterval(avoidanceTimerRef.current);
            avoidanceTimerRef.current = null;
        }
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (accepted || level >= MAX_LEVEL || !noButtonRef.current) return;

        // Current Button State
        const buttonRect = noButtonRef.current.getBoundingClientRect();
        const btnW = buttonRect.width || 100; // Fallback width
        const btnH = buttonRect.height || 50;  // Fallback height

        // Mouse Position
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Button Center logic
        const currentX = posRef.current.x;
        const currentY = posRef.current.y;
        const centerX = currentX + btnW / 2;
        const centerY = currentY + btnH / 2;

        const dx = centerX - mouseX;
        const dy = centerY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const threshold = 200; // Increased threshold for earlier reaction

        if (distance < threshold) {
            startTicking();

            // Normalized push vector
            const strength = (threshold - distance) / threshold;
            const pushFactor = 30 * strength;

            let moveX = (dx / (distance || 1)) * pushFactor;
            let moveY = (dy / (distance || 1)) * pushFactor;

            // Add some jitter/randomness for unpredictability
            moveX += (Math.random() - 0.5) * 5;
            moveY += (Math.random() - 0.5) * 5;

            let nextX = currentX + moveX * 25; // Increased speed multiplier
            let nextY = currentY + moveY * 25;

            // Strict Clamping to Viewport
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            const margin = 20;
            const minX = margin;
            const minY = margin;
            const maxX = viewportW - btnW - margin;
            const maxY = viewportH - btnH - margin;

            // Wall sliding logic
            if (nextX <= minX || nextX >= maxX) {
                moveY += Math.sign(dy) * 20;
            }
            if (nextY <= minY || nextY >= maxY) {
                moveX += Math.sign(dx) * 20;
            }

            // Apply clamp
            nextX = Math.max(minX, Math.min(maxX, nextX));
            nextY = Math.max(minY, Math.min(maxY, nextY));

            // Corner Teleportation Logic
            const isAtEdgeX = nextX === minX || nextX === maxX;
            const isAtEdgeY = nextY === minY || nextY === maxY;

            if (isAtEdgeX && isAtEdgeY) {
                nextX = minX + (Math.random() * 0.6 + 0.2) * (maxX - minX);
                nextY = minY + (Math.random() * 0.6 + 0.2) * (maxY - minY);
            }

            posRef.current = { x: nextX, y: nextY };
            setNoButtonPos({ x: nextX, y: nextY });
        } else {
            stopTicking();
        }
    }, [accepted, level, MAX_LEVEL, startTicking, stopTicking]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            stopTicking();
        };
    }, [handleMouseMove, stopTicking]);

    const handleYesClick = () => {
        stopTicking();
        setAccepted(true);
    };

    if (accepted) {
        return <SuccessScreen name={name} />;
    }

    if (!isInitialized) return null; // Prevent hydration mismatch or flash

    return (
        <div
            className="fixed inset-0 w-screen h-screen overflow-hidden"
            style={{
                backgroundImage: 'url(/background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >

            {/* Centered Content (Header & Yes Button) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-12 pointer-events-none">
                <div className="pointer-events-auto">
                    <QuestionHeader name={name} />
                </div>
                <div className="pointer-events-auto">
                    <YesButton level={level} onClick={handleYesClick} />
                </div>
            </div>

            {/* Free Roaming No Button */}
            <div
                className="absolute pointer-events-auto transition-transform duration-75 ease-linear will-change-transform"
                style={{
                    left: 0,
                    top: 0,
                    transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                }}
            >
                <NoButton
                    ref={noButtonRef}
                    level={level}
                    maxLevel={MAX_LEVEL}
                    position={{ x: 0, y: 0 }} // Managed by parent div transform
                    onInteraction={handleNoInteraction}
                    onClick={level >= MAX_LEVEL ? handleYesClick : handleNoInteraction}
                />
            </div>

            <HeartDecorator level={level} maxLevel={MAX_LEVEL} />
        </div>
    );
};
