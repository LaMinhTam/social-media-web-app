interface UserReaction {
    userId: number;
    reactions: string[];
    count: number;
}

const handleReduceAllReaction = (reactions: {
    [key: string]: number[];
}): UserReaction[] => {
    const userMap: Map<number, { reactions: Set<string>; count: number }> =
        new Map();

    Object.entries(reactions).forEach(([reaction, userIds]) => {
        userIds.forEach((userId) => {
            if (!userMap.has(userId)) {
                userMap.set(userId, {
                    reactions: new Set([reaction]),
                    count: 1,
                });
            } else {
                const userReaction = userMap.get(userId)!;
                userReaction.reactions.add(reaction);
                userReaction.count += 1;
                userMap.set(userId, userReaction);
            }
        });
    });

    return Array.from(userMap.entries()).map(
        ([userId, { reactions, count }]) => ({
            userId,
            reactions: Array.from(reactions),
            count,
        })
    );
};

export default handleReduceAllReaction;
