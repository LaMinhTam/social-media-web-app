import { REACTIONS_DATA } from "@/constants/global";
import React from "react";

const ReactionPicker = ({
    handleReactionClick,
}: {
    handleReactionClick: (reaction: { name: string; emoji: string }) => void;
}) => {
    return (
        <div>
            <div className="flex items-center justify-center px-3 py-2 rounded-full shadow-md bg-lite">
                {REACTIONS_DATA.map((reaction) => (
                    <button
                        key={reaction.name}
                        onClick={() => handleReactionClick(reaction)}
                        className="w-[38px] h-9 hover:bg-text6 hover:text-text1 rounded-full 
                        flex items-center justify-center gap-x-1 transition-colors duration-300 ease-in-out"
                    >
                        <span className="text-3xl">{reaction.emoji}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ReactionPicker;
