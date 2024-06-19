package vn.edu.iuh.fit.postservice.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.postservice.entity.neo4j.*;
import vn.edu.iuh.fit.postservice.exception.AppException;
import vn.edu.iuh.fit.postservice.repository.neo4j.CommentNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.PostNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.ReactionNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.UserNodeRepository;
import vn.edu.iuh.fit.postservice.service.ReactionService;

import java.util.Optional;

@Service
public class ReactionServiceImpl implements ReactionService {
    private final ReactionNodeRepository reactionNodeRepository;
    private final PostNodeRepository postNodeRepository;
    private final CommentNodeRepository commentNodeRepository;
    private final UserNodeRepository userNodeRepository;

    public ReactionServiceImpl(ReactionNodeRepository reactionNodeRepository, PostNodeRepository postNodeRepository,
                               CommentNodeRepository commentNodeRepository, UserNodeRepository userNodeRepository) {
        this.reactionNodeRepository = reactionNodeRepository;
        this.postNodeRepository = postNodeRepository;
        this.commentNodeRepository = commentNodeRepository;
        this.userNodeRepository = userNodeRepository;
    }

    @Override
    public boolean reactToPost(String postId, Long userId, ReactionType reactionType) {
        PostNode post = postNodeRepository.findById(postId)
                .orElseThrow(() -> new AppException(404, "Post not found"));
        UserNode userNode = userNodeRepository.findById(userId)
                .orElseThrow(() -> new AppException(404, "User not found"));

        return handleReaction(postId, userId, reactionType, userNode, post, null);
    }

    @Override
    public boolean reactToComment(String commentId, Long userId, ReactionType reactionType) {
        CommentNode comment = commentNodeRepository.findById(commentId)
                .orElseThrow(() -> new AppException(404, "Comment not found"));
        UserNode userNode = userNodeRepository.findById(userId)
                .orElseThrow(() -> new AppException(404, "User not found"));

        return handleReaction(commentId, userId, reactionType, userNode, null, comment);
    }

    private boolean handleReaction(String targetId, Long userId, ReactionType reactionType,
                                   UserNode userNode, PostNode post, CommentNode comment) {
        Optional<ReactionNode> existingReactionOpt = userNode.getReactions().stream()
                .filter(r -> (r.getPost() != null && r.getPost().getPostId().equals(targetId)) ||
                        (r.getComment() != null && r.getComment().getCommentId().equals(targetId)))
                .findFirst();

        if (existingReactionOpt.isPresent()) {
            ReactionNode existingReaction = existingReactionOpt.get();
            if (!existingReaction.getType().equals(reactionType)) {
                existingReaction.setType(reactionType);
                reactionNodeRepository.save(existingReaction);
                return true;
            }
            reactionNodeRepository.delete(existingReaction);
            return false;
        }

        ReactionNode reaction = ReactionNode.builder()
                .type(reactionType)
                .user(userNode)
                .targetId(targetId)
                .post(post)
                .comment(comment)
                .build();

        if (post != null) {
            post.getReactions().add(reaction);
            postNodeRepository.save(post);
        } else if (comment != null) {
            comment.getReactions().add(reaction);
            commentNodeRepository.save(comment);
        }

        userNode.getReactions().add(reaction);
        reactionNodeRepository.save(reaction);
        userNodeRepository.save(userNode);

        return true;
    }
}