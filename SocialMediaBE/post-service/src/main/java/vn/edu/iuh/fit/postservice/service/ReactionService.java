package vn.edu.iuh.fit.postservice.service;

import vn.edu.iuh.fit.postservice.dto.UserDetail;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionType;

import java.util.List;
import java.util.Map;

public interface ReactionService {
    boolean reactToPost(String postId, Long userId, ReactionType reactionType);

    boolean reactToComment(String commentId, Long userId, ReactionType reactionType);

    Map<ReactionType, List<UserDetail>> getPostReaction(Long id, String postId);

    Map<ReactionType, List<UserDetail>> getCommentReaction(Long id, String commentId);
}
