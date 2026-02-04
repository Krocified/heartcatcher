"use client";

import React, { useState, useEffect } from "react";
import { SuccessScreen } from "./SuccessScreen";
import { RunningNoButtonGame, FindNoButtonGame } from "./games";
import type { GameProps } from "@/types/game";

const DESKTOP_GAMES = [RunningNoButtonGame, FindNoButtonGame];
const MOBILE_GAMES = [FindNoButtonGame];

export const HeartCatcher = () => {
    const [accepted, setAccepted] = useState(false);
    const [SelectedGame, setSelectedGame] = useState<React.ComponentType<GameProps> | null>(null);

    const name = process.env.NEXT_PUBLIC_VALENTINE_NAME || "Valentine";

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const gamePool = isMobile ? MOBILE_GAMES : DESKTOP_GAMES;
        const selectedGame = gamePool[Math.floor(Math.random() * gamePool.length)];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedGame(() => selectedGame);
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
