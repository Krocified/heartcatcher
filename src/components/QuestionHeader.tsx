"use client";

import React from "react";
import Image from "next/image";

interface QuestionHeaderProps {
    name: string;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({ name }) => {
    return (
        <div className="text-center mb-12 flex flex-col items-center">
            <Image
                src="/brown-bear-brown.gif"
                alt="Cute Bear"
                width={192}
                height={192}
                className="object-contain mb-4"
                priority
            />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-4">
                {name}, will you be my Valentine?
            </h1>
        </div>
    );
};
