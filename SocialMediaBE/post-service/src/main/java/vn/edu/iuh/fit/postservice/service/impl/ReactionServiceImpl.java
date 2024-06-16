package vn.edu.iuh.fit.postservice.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.postservice.entity.neo4j.*;
import vn.edu.iuh.fit.postservice.exception.AppException;
import vn.edu.iuh.fit.postservice.repository.neo4j.CommentNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.PostNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.ReactionNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.UserNodeRepository;
import vn.edu.iuh.fit.postservice.service.ReactionService;

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
    public Long reactToPost(String postId, Long userId, ReactionType reactionType) {
        PostNode post = postNodeRepository.findById(postId)
                .orElseThrow(() -> new AppException(404, "Post not found"));
        UserNode userNode = userNodeRepository.findById(userId)
                .orElseThrow(() -> new AppException(404, "User not found"));
        ReactionNode reaction = ReactionNode.builder()
                .type(reactionType)
                .user(userNode)
                .targetId(postId)
                .post(post)
                .build();
        post.getReactions().add(reaction);
        postNodeRepository.save(post);
        return reactionNodeRepository.save(reaction).getId();
    }

    @Override
    public Long reactToComment(String commentId, Long userId, ReactionType reactionType) {
        CommentNode comment = commentNodeRepository.findById(commentId)
                .orElseThrow(() -> new AppException(404, "Comment not found"));
        UserNode userNode = userNodeRepository.findById(userId)
                .orElseThrow(() -> new AppException(404, "User not found"));
        ReactionNode reaction = ReactionNode.builder()
                .type(reactionType)
                .user(userNode)
                .targetId(commentId)
                .comment(comment)
                .build();
        comment.getReactions().add(reaction);
        commentNodeRepository.save(comment);
        return reactionNodeRepository.save(reaction).getId();
    }
}