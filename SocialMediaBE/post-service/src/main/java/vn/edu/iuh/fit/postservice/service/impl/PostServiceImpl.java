package vn.edu.iuh.fit.postservice.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.postservice.client.UserClient;
import vn.edu.iuh.fit.postservice.dto.PostDTO;
import vn.edu.iuh.fit.postservice.dto.PostDetail;
import vn.edu.iuh.fit.postservice.dto.UserDetail;
import vn.edu.iuh.fit.postservice.entity.mongo.Post;
import vn.edu.iuh.fit.postservice.entity.neo4j.PostNode;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionType;
import vn.edu.iuh.fit.postservice.entity.neo4j.UserNode;
import vn.edu.iuh.fit.postservice.exception.AppException;
import vn.edu.iuh.fit.postservice.repository.mongo.PostRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.PostNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.ReactionNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.UserNodeRepository;
import vn.edu.iuh.fit.postservice.service.PostService;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final PostNodeRepository postNodeRepository;
    private final UserNodeRepository userNodeRepository;
    private final UserClient userClient;
    private final ReactionNodeRepository reactionNodeRepository;

    public PostServiceImpl(PostRepository postRepository, PostNodeRepository postNodeRepository, UserNodeRepository userNodeRepository, UserClient userClient, ReactionNodeRepository reactionNodeRepository) {
        this.postRepository = postRepository;
        this.postNodeRepository = postNodeRepository;
        this.userNodeRepository = userNodeRepository;
        this.userClient = userClient;
        this.reactionNodeRepository = reactionNodeRepository;
    }

    @Override
    public List<PostDetail> findPostsByUserId(Long userId) {
        List<PostNode> postNodes = postNodeRepository.findByAuthorsUserId(userId);

        List<String> postIds = postNodes.stream()
                .map(PostNode::getPostId)
                .toList();
        Set<Long> authorIds = postNodes.stream()
                .map(PostNode::getAuthors)
                .flatMap(Set::stream)
                .map(UserNode::getUserId)
                .collect(Collectors.toSet());

        Map<Long, UserDetail> authorsMap = userClient.getUsersByIdsMap(new ArrayList<>(authorIds));

        Map<String, List<UserDetail>> postAuthorsMap = postNodes.stream()
                .collect(Collectors.toMap(
                        PostNode::getPostId,
                        postNode -> postNode.getAuthors().stream()
                                .map(UserNode::getUserId)
                                .map(authorsMap::get)
                                .toList()
                ));

        List<Post> posts = postRepository.findByIdIn(postIds);
        Map<String, Map<ReactionType, Long>> reactionsMap = reactionNodeRepository.getReactionsForPosts(postIds);

        return posts.stream()
                .map(post -> new PostDetail(post, postAuthorsMap.get(post.getId()), reactionsMap.get(post.getId())))
                .toList();

    }

    @Override
    public String savePost(Long userId, List<Long> coAuthor, String content, List<String> media) {
        Post post = Post.builder()
                .content(content)
                .media(media)
                .createAt(new Date())
                .updateAt(new Date())
                .build();
        post = postRepository.save(post);

        PostNode postNode = new PostNode(post.getId());
        Set<Long> userIds = new HashSet<>();
        userIds.add(userId);
        if (coAuthor != null) {
            userIds.addAll(coAuthor);
        }

        List<UserNode> userNodes = userNodeRepository.findAllById(userIds);
        if (userNodes.isEmpty() || userNodes.stream().noneMatch(user -> user.getUserId().equals(userId))) {
            throw new AppException(404, "User not found");
        }
        postNode.setAuthors(new HashSet<>(userNodes));

        return postNodeRepository.save(postNode).getPostId();
    }

    @Override
    public Map<String, PostDetail> findUserWall(Long userId, int page, int size) {
        List<PostDTO> postNodes = postNodeRepository.findUserWall(userId, page, size);
        return bindPostDetail(postNodes);
    }

    @Override
    public Map<String, PostDetail> findNewFeed(Long userId, int page, int size) {
        List<PostDTO> postNodes = postNodeRepository.findNewFeed(userId, page, size);
        return bindPostDetail(postNodes);
    }

    public Map<String, PostDetail> bindPostDetail(List<PostDTO> postNodes) {
        List<String> postIds = postNodes.stream()
                .map(PostDTO::getPostId)
                .toList();
        Map<String, Post> posts = postRepository.findByIdIn(postIds).stream()
                .collect(Collectors.toMap(Post::getId, post -> post));
        List<Long> authorIds = postNodes.stream()
                .map(PostDTO::getAuthorId)
                .toList();
        Map<Long, UserDetail> authorsMap = userClient.getUsersByIdsMap(authorIds);
        Map<String, Map<ReactionType, Long>> reactionsMap = reactionNodeRepository.getReactionsForPosts(postIds);
        return postNodes.stream()
                .collect(Collectors.toMap(
                        PostDTO::getPostId,
                        postNode -> new PostDetail(
                                posts.get(postNode.getPostId()),
                                List.of(authorsMap.get(postNode.getAuthorId())),
                                reactionsMap.get(postNode.getPostId())),
                        (oldValue, newValue) -> oldValue,
                        LinkedHashMap::new
                ));
    }
}
