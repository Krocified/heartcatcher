"use client";

import React from "react";

interface QuestionHeaderProps {
    name: string;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({ name }) => {
    return (
        <div className="text-center mb-12">
            <div className="text-6xl mb-4">💝</div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-4">
                {name}, will you be my Valentine?
            </h1>
        </div>
    );
};
