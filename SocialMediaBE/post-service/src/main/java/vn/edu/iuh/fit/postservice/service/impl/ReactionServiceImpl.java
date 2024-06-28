package vn.edu.iuh.fit.postservice.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.postservice.client.UserClient;
import vn.edu.iuh.fit.postservice.dto.UserDetail;
import vn.edu.iuh.fit.postservice.entity.neo4j.*;
import vn.edu.iuh.fit.postservice.exception.AppException;
import vn.edu.iuh.fit.postservice.repository.neo4j.*;
import vn.edu.iuh.fit.postservice.service.ReactionService;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ReactionServiceImpl implements ReactionService {
    private final ReactionNodeRepository reactionNodeRepository;
    private final PostNodeRepository postNodeRepository;
    private final CommentNodeRepository commentNodeRepository;
    private final UserNodeRepository userNodeRepository;
    private final UserClient userClient;
    private final UserCategoryInterestRepository userCategoryInterestRepository;

    public ReactionServiceImpl(ReactionNodeRepository reactionNodeRepository, PostNodeRepository postNodeRepository,
                               CommentNodeRepository commentNodeRepository, UserNodeRepository userNodeRepository, UserClient userClient, UserCategoryInterestRepository userCategoryInterestRepository) {
        this.reactionNodeRepository = reactionNodeRepository;
        this.postNodeRepository = postNodeRepository;
        this.commentNodeRepository = commentNodeRepository;
        this.userNodeRepository = userNodeRepository;
        this.userClient = userClient;
        this.userCategoryInterestRepository = userCategoryInterestRepository;
    }

    @Override
    public boolean reactToPost(String postId, Long userId, ReactionType reactionType) {
        PostNode post = postNodeRepository.findById(postId)
                .orElseThrow(() -> new AppException(404, "Post not found"));
        UserNode userNode = userNodeRepository.findById(userId)
                .orElseThrow(() -> new AppException(404, "User not found"));
        boolean result = handleReaction(postId, reactionType, userNode, post, null);
        if (result) {
            new Thread(() -> updateInterestScore(userNode, post)).start();
        }
        return result;
    }

    private void updateInterestScore(UserNode user, PostNode post) {
        if (post.getCategories() != null) {
            for (CategoryNode category : post.getCategories()) {
                UserCategoryInterest interest = user.getCategoryInterests().stream()
                        .filter(uci -> uci.getCategory().equals(category))
                        .findFirst()
                        .orElse(null);

                if (interest == null) {
                    interest = new UserCategoryInterest();
                    interest.setUser(user);
                    interest.setCategory(category);
                    interest.setScore(0.0);
                    interest.setLastUpdated(LocalDateTime.now());
                    user.getCategoryInterests().add(interest);
                } else {
                    calculateDecay(user, interest);
                }

                interest.updateScore(1.0); // Adjust the interaction score as needed
                if (shouldUpdateInterest(interest)) {
                    interest.updateScore(1.0); // Example interaction score increment
                }
            }

            userNodeRepository.save(user);
        }
    }

    private boolean shouldUpdateInterest(UserCategoryInterest interest) {
        int reactionThreshold = 10; // Example threshold
        long timeThresholdDays = 7; // Example time threshold in days

        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(interest.getLastUpdated(), now);
        long days = duration.toDays();

        return (interest.getScore() > reactionThreshold && days < timeThresholdDays);
    }

    private void calculateDecay(UserNode user, UserCategoryInterest interest) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(interest.getLastUpdated(), now);
        long days = duration.toDays();
        if (days > 0) {
            double decayFactor = 0.9; // Decay factor, adjust as needed
            double decayedScore = interest.getScore() * Math.pow(decayFactor, days);
            interest.setScore(decayedScore);
            interest.setLastUpdated(now);
            user.getCategoryInterests().removeIf(uci -> uci.getCategory().equals(interest.getCategory()));
            user.getCategoryInterests().add(interest);
        }
    }

    @Override
    public boolean reactToComment(String commentId, Long userId, ReactionType reactionType) {
        CommentNode comment = commentNodeRepository.findById(commentId)
                .orElseThrow(() -> new AppException(404, "Comment not found"));
        UserNode userNode = userNodeRepository.findById(userId)
                .orElseThrow(() -> new AppException(404, "User not found"));

        return handleReaction(commentId, reactionType, userNode, null, comment);
    }

    @Override
    public Map<ReactionType, List<UserDetail>> getPostReaction(Long id, String postId) {
        PostNode post = postNodeRepository.findById(postId)
                .orElseThrow(() -> new AppException(404, "Post not found"));

        return getReactionsMap(post.getReactions());
    }

    @Override
    public Map<ReactionType, List<UserDetail>> getCommentReaction(Long id, String commentId) {
        CommentNode comment = commentNodeRepository.findById(commentId)
                .orElseThrow(() -> new AppException(404, "Comment not found"));

        return getReactionsMap(comment.getReactions());
    }

    private Map<ReactionType, List<UserDetail>> getReactionsMap(Set<ReactionNode> reactions) {
        List<Long> userIds = reactions.stream()
                .map(r -> r.getUser().getUserId())
                .toList();

        Map<Long, UserDetail> userDetailMap = userClient.getUsersByIdsMap(userIds);
        EnumMap<ReactionType, List<UserDetail>> reactionTypeListMap = new EnumMap<>(ReactionType.class);

        for (ReactionNode reaction : reactions) {
            ReactionType reactionType = reaction.getType();
            Long userId = reaction.getUser().getUserId();
            UserDetail userDetail = userDetailMap.get(userId);

            reactionTypeListMap
                    .computeIfAbsent(reactionType, k -> new ArrayList<>())
                    .add(userDetail);
        }
        return reactionTypeListMap;
    }

    private boolean handleReaction(String targetId, ReactionType reactionType,
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