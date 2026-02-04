"use client";

import React, { useState, useEffect } from "react";
import { SuccessScreen } from "./SuccessScreen";
import { RunningNoButtonGame } from "./games";
import type { GameProps } from "@/types/game";

const AVAILABLE_GAMES: React.ComponentType<GameProps>[] = [
    RunningNoButtonGame,
];

export const HeartCatcher = () => {
    const [accepted, setAccepted] = useState(false);
    const [SelectedGame, setSelectedGame] = useState<React.ComponentType<GameProps> | null>(null);

    const name = process.env.NEXT_PUBLIC_VALENTINE_NAME || "Valentine";

    useEffect(() => {
        // Randomly select a game on mount
        const randomGame = AVAILABLE_GAMES[Math.floor(Math.random() * AVAILABLE_GAMES.length)];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedGame(() => randomGame);
    }, []);

    const handleAccept = () => setAccepted(true);

    if (!SelectedGame) return null;

    return (
        <div
            className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center"
            style={{
                backgroundImage: 'url(/background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {accepted ? (
                <SuccessScreen name={name} />
            ) : (
                <SelectedGame name={name} onAccept={handleAccept} />
            )}
        </div>
    );
};
