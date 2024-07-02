package vn.edu.iuh.fit.postservice.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.postservice.client.UserClient;
import vn.edu.iuh.fit.postservice.dto.SortStrategy;
import vn.edu.iuh.fit.postservice.dto.CommentDetailDTO;
import vn.edu.iuh.fit.postservice.dto.UserDetail;
import vn.edu.iuh.fit.postservice.entity.mongo.Comment;
import vn.edu.iuh.fit.postservice.entity.neo4j.CommentNode;
import vn.edu.iuh.fit.postservice.entity.neo4j.PostNode;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionType;
import vn.edu.iuh.fit.postservice.entity.neo4j.UserNode;
import vn.edu.iuh.fit.postservice.exception.AppException;
import vn.edu.iuh.fit.postservice.repository.mongo.CommentRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.CommentNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.PostNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.ReactionNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.UserNodeRepository;
import vn.edu.iuh.fit.postservice.service.CommentService;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentNodeRepository commentNodeRepository;
    private final CommentRepository commentRepository;
    private final UserNodeRepository userNodeRepository;
    private final PostNodeRepository postNodeRepository;
    private final ReactionNodeRepository reactionNodeRepository;
    private final UserClient userClient;

    public CommentServiceImpl(CommentNodeRepository commentNodeRepository, CommentRepository commentRepository, UserNodeRepository userNodeRepository, PostNodeRepository postNodeRepository, ReactionNodeRepository reactionNodeRepository, UserClient userClient) {
        this.commentNodeRepository = commentNodeRepository;
        this.commentRepository = commentRepository;
        this.userNodeRepository = userNodeRepository;
        this.postNodeRepository = postNodeRepository;
        this.reactionNodeRepository = reactionNodeRepository;
        this.userClient = userClient;
    }


    @Override
    public String saveComment(Long author, String postId, String content, List<String> media, List<Long> tags, String parentCommentId) {
        Comment comment = saveCommentToMongo(content, media, author, tags);
        PostNode postNode = postNodeRepository.findById(postId).orElseThrow(() -> new AppException(404, "Post not found"));
        CommentNode newCommentNode = createCommentNode(author, postNode, comment, tags, parentCommentId);

        postNode.getComments().add(newCommentNode);

        postNodeRepository.save(postNode);

        return newCommentNode.getCommentId();
    }

    private CommentNode createCommentNode(Long authorId, PostNode postNode, Comment comment, List<Long> tags, String parentCommentId) {
        UserNode author = userNodeRepository.findById(authorId).orElseThrow(() -> new AppException(404, "User not found"));

        CommentNode commentNode = new CommentNode(comment.getId());

        commentNode.setAuthor(author);
        commentNode.setPostNode(postNode);

        if (parentCommentId != null) {
            CommentNode parentCommentNode = commentNodeRepository.findById(parentCommentId).orElseThrow(() -> new AppException(404, "Parent comment not found"));
            commentNode.setParentComment(parentCommentNode);
            commentNodeRepository.findById(parentCommentId).ifPresent(parentComment -> {
                parentComment.getChildComments().add(commentNode);
                commentNodeRepository.save(parentComment);
            });
        }
        if (tags != null) {
            Set<UserNode> taggedUsers = new HashSet<>();
            for (Long tagId : tags) {
                UserNode taggedUser = userNodeRepository.findById(tagId).orElseThrow(() -> new AppException(404, "Tagged user not found"));
                taggedUsers.add(taggedUser);
            }
            commentNode.setTaggedUsers(taggedUsers);
        }
        if (parentCommentId != null) {
            CommentNode parentCommentNode = commentNodeRepository.findById(parentCommentId).orElseThrow(() -> new AppException(404, "Parent comment not found"));
            commentNode.setParentComment(parentCommentNode);
        }

        return commentNodeRepository.save(commentNode);
    }

    private Comment saveCommentToMongo(String content, List<String> media, Long id, List<Long> tags) {
        Comment comment = new Comment(content, media, id, tags, new Date(), new Date());
        return commentRepository.save(comment);
    }

    @Override
    public List<CommentDetailDTO> getCommentsByPostId(String postId, SortStrategy sortStrategy, int page, int size) {
        List<String> commentIds = extractCommentIdsFromPost(postId);
        Map<String, Comment> commentMap = fetchCommentsByIds(commentIds);
        List<CommentNode> commentNodes = commentNodeRepository.findAllById(commentIds);

        Map<Long, UserDetail> userDetailMap = fetchUserDetailsFromCommentNodes(commentNodes);
        Map<String, Map<ReactionType, Long>> reactionMap = reactionNodeRepository.getReactionsForComments(commentIds);

        List<CommentNode> paginatedCommentNodes = sortCommentsByReactions(commentNodes, commentMap, reactionMap, sortStrategy, page, size);

        return paginatedCommentNodes.stream()
                .map(commentNode -> mapToCommentDetailDTO(commentMap, commentNode, userDetailMap, reactionMap))
                .toList();
    }

    private List<String> extractCommentIdsFromPost(String postId) {
        PostNode postNode = postNodeRepository.findById(postId).orElseThrow(() -> new AppException(404, "Post not found"));

        return postNode.getComments().stream()
                .map(CommentNode::getCommentId)
                .toList();
    }

    private Map<Long, UserDetail> fetchUserDetailsFromCommentNodes(List<CommentNode> commentNodes) {
        Set<Long> userIds = new HashSet<>();
        commentNodes.forEach(commentNode -> {
            userIds.add(commentNode.getAuthor().getUserId());
            commentNode.getTaggedUsers().forEach(user -> userIds.add(user.getUserId()));
        });

        return userClient.getUsersByIdsMap(new ArrayList<>(userIds));
    }

    private Map<String, Comment> fetchCommentsByIds(List<String> commentIds) {
        List<Comment> comments = commentRepository.findByIdIn(commentIds);
        return comments.stream()
                .collect(Collectors.toMap(Comment::getId, comment -> comment));
    }

    private List<CommentNode> sortCommentsByReactions(List<CommentNode> commentNodes, Map<String, Comment> commentMap, Map<String, Map<ReactionType, Long>> reactionMap, SortStrategy sortStrategy, int page, int size) {
        commentNodes = commentNodes.stream()
                .filter(commentNode -> commentNode.getParentComment() == null)
                .collect(Collectors.toList());

        switch (sortStrategy) {
            case NEWEST:
                commentNodes.sort(Comparator.comparing(CommentNode::getCreateAt).reversed());
                break;
            case OLDEST:
                commentNodes.sort(Comparator.comparing(CommentNode::getCreateAt));
                break;
            case POPULAR:
                commentNodes.sort(Comparator.comparingInt(commentNode -> -reactionMap.getOrDefault(commentNode.getCommentId(), Collections.emptyMap()).size()));
                break;
            default:
                throw new IllegalArgumentException("Unsupported sort strategy: " + sortStrategy);
        }

        try {
            int fromIndex = page * size;
            int toIndex = Math.min(fromIndex + size, commentNodes.size());
            return commentNodes.subList(fromIndex, toIndex);
        } catch (IllegalArgumentException | IndexOutOfBoundsException e) {
            throw new AppException(400, "Invalid page or size.");
        }
    }


    private CommentDetailDTO mapToCommentDetailDTO(Map<String, Comment> comments, CommentNode
            commentNode, Map<Long, UserDetail> userDetailMap, Map<String, Map<ReactionType, Long>> reactionMap) {
        Comment currentComment = comments.get(commentNode.getCommentId());

        UserDetail author = userDetailMap.get(commentNode.getAuthor().getUserId());
        List<UserDetail> tags = commentNode.getTaggedUsers().stream()
                .map(UserNode::getUserId)
                .map(userDetailMap::get)
                .toList();

        List<CommentDetailDTO> childComments = commentNode.getChildComments().stream()
                .map(childComment -> mapToCommentDetailDTO(comments, childComment, userDetailMap, reactionMap))
                .toList();

        Map<ReactionType, Long> reactions = reactionMap.getOrDefault(commentNode.getCommentId(), Collections.emptyMap());

        return new CommentDetailDTO(
                currentComment.getId(),
                currentComment.getContent(),
                currentComment.getMedia(),
                author,
                tags,
                currentComment.getCreateAt(),
                currentComment.getUpdateAt(),
                childComments,
                reactions
        );
    }
}
