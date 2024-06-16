package vn.edu.iuh.fit.postservice.service;

import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionType;

public interface ReactionService {
    Long reactToPost(String postId, Long userId, ReactionType reactionType);

    Long reactToComment(String commentId, Long userId, ReactionType reactionType);
}
