package vn.edu.iuh.fit.postservice.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.postservice.client.UserClient;
import vn.edu.iuh.fit.postservice.dto.PostDTO;
import vn.edu.iuh.fit.postservice.dto.PostDetail;
import vn.edu.iuh.fit.postservice.dto.UserDetail;
import vn.edu.iuh.fit.postservice.entity.mongo.Post;
import vn.edu.iuh.fit.postservice.entity.neo4j.*;
import vn.edu.iuh.fit.postservice.exception.AppException;
import vn.edu.iuh.fit.postservice.repository.mongo.PostRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.CategoryNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.PostNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.ReactionNodeRepository;
import vn.edu.iuh.fit.postservice.repository.neo4j.UserNodeRepository;
import vn.edu.iuh.fit.postservice.service.PostService;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final PostNodeRepository postNodeRepository;
    private final UserNodeRepository userNodeRepository;
    private final UserClient userClient;
    private final ReactionNodeRepository reactionNodeRepository;
    private final CategoryNodeRepository categoryNodeRepository;

    public PostServiceImpl(PostRepository postRepository, PostNodeRepository postNodeRepository, UserNodeRepository userNodeRepository, UserClient userClient, ReactionNodeRepository reactionNodeRepository, CategoryNodeRepository categoryNodeRepository) {
        this.postRepository = postRepository;
        this.postNodeRepository = postNodeRepository;
        this.userNodeRepository = userNodeRepository;
        this.userClient = userClient;
        this.reactionNodeRepository = reactionNodeRepository;
        this.categoryNodeRepository = categoryNodeRepository;
    }

    @Override
    public List<PostDetail> findPostsByUserId(Long userId) {
        List<PostNode> postNodes = postNodeRepository.findByAuthorsUserId(userId);
        List<String> postIdsToQuery = collectPostIdsToQuery(postNodes);
        Set<Long> authorIds = collectPostNodeAuthorIds(postNodes);
        Map<Long, UserDetail> authorsMap = userClient.getUsersByIdsMap(new ArrayList<>(authorIds));
        Map<String, List<UserDetail>> postAuthorsMap = createPostAuthorsMap(postNodes, authorsMap);
        List<Post> posts = postRepository.findByIdIn(postIdsToQuery);
        Map<String, Map<ReactionType, Long>> reactionsMap = reactionNodeRepository.getReactionsForPosts(postIdsToQuery);
        Map<String, PostDetail> postDetailMap = createPostDetailMap(posts, postAuthorsMap, reactionsMap);

        return postIdsToQuery.stream().map(id -> postDetailMap.getOrDefault(id, null)).toList();
    }

    private List<String> collectPostIdsToQuery(List<PostNode> postNodes) {
        List<String> postIdsToQuery = new ArrayList<>();
        postNodes.forEach(postNode -> {
            postIdsToQuery.add(postNode.getPostId());
            if (postNode.getOriginalPost() != null) {
                postIdsToQuery.add(postNode.getOriginalPost().getPostId());
            }
        });
        return postIdsToQuery;
    }

    private Set<Long> collectPostNodeAuthorIds(List<PostNode> postNodes) {
        return postNodes.stream()
                .map(PostNode::getAuthors)
                .flatMap(Set::stream)
                .map(UserNode::getUserId)
                .collect(Collectors.toSet());
    }

    private Map<String, List<UserDetail>> createPostAuthorsMap(List<PostNode> postNodes, Map<Long, UserDetail> authorsMap) {
        return postNodes.stream()
                .collect(Collectors.toMap(
                        PostNode::getPostId,
                        postNode -> postNode.getAuthors().stream()
                                .map(UserNode::getUserId)
                                .map(authorsMap::get)
                                .toList()
                ));
    }

    private Map<String, PostDetail> createPostDetailMap(List<Post> posts, Map<String, List<UserDetail>> postAuthorsMap, Map<String, Map<ReactionType, Long>> reactionsMap) {
        return posts.stream()
                .collect(Collectors.toMap(
                        Post::getId,
                        post -> new PostDetail(post, postAuthorsMap.get(post.getId()), reactionsMap.get(post.getId()))
                ));
    }

    @Override
    public String savePost(Long userId, List<Long> coAuthor, String content, List<String> media, Set<Category> categories) {
        Post post = new Post(content, media);
        post = postRepository.save(post);
        Set<CategoryNode> categoryNodes = handleCategories(categories);
        PostNode postNode = new PostNode(post.getId(), categoryNodes);
        Set<Long> userIds = new HashSet<>();
        userIds.add(userId);
        if (coAuthor != null) {
            userIds.addAll(coAuthor);
        }
        setPostAuthors(postNode, userId, userIds);

        return postNodeRepository.save(postNode).getPostId();
    }

    private Set<CategoryNode> handleCategories(Set<Category> categories) {
        if (Optional.ofNullable(categories).isEmpty()) {
            return getOrCreateCategoryNodes(new HashSet<>(Set.of(Category.OTHER)));
        } else if (categories.contains(Category.OTHER) && categories.size() > 1) {
            Set<Category> filteredCategories = categories.stream().filter(category -> category != Category.OTHER).collect(Collectors.toSet());
            return getOrCreateCategoryNodes(filteredCategories);
        } else {
            return getOrCreateCategoryNodes(categories);
        }
    }

    private Set<CategoryNode> getOrCreateCategoryNodes(Set<Category> categories) {
        Set<CategoryNode> categoryNodes = categoryNodeRepository.findByCategoryIn(categories);
        if (categoryNodes.size() != categories.size()) {
            Set<Category> foundCategories = categoryNodes.stream().map(CategoryNode::getCategory).collect(Collectors.toSet());
            categories.removeAll(foundCategories);
            for (Category category : categories) {
                CategoryNode newCategoryNode = new CategoryNode(category, category.getDescription());
                categoryNodes.add(categoryNodeRepository.save(newCategoryNode));
            }
        }
        return categoryNodes;
    }

    public void setPostAuthors(PostNode postNode, Long userId, Set<Long> userIds) {
        List<UserNode> userNodes = userNodeRepository.findAllById(userIds);
        if (userNodes.isEmpty() || userNodes.stream().noneMatch(user -> user.getUserId().equals(userId))) {
            throw new AppException(404, "User not found");
        }
        postNode.setAuthors(new HashSet<>(userNodes));
    }

    @Override
    public Map<String, PostDetail> findUserWall(Long userId, int page, int size) {
        List<PostDTO> postNodes = postNodeRepository.findUserWall(userId, page, size);
        return bindPostDetail(postNodes);
    }

    @Override
    public Map<String, PostDetail> findNewFeed(Long userId, int page, int size) {
        List<PostDTO> postNodes = postNodeRepository.findNewFeed(userId, page, size);
        Thread thread = new Thread(() -> {
            List<String> postIds = postNodes.stream()
                    .map(PostDTO::getPostId)
                    .toList();
            UserNode userNode = userNodeRepository.findById(userId).orElseThrow(() -> new AppException(404, "User not found"));
            List<PostNode> reachPost = postNodeRepository.findAllById(postIds);
            userNode.getReach().addAll(reachPost);
            userNodeRepository.save(userNode);
        });
        thread.start();
        return bindPostDetail(postNodes);
    }

    @Override
    public String sharePost(Long userId, String s, String content) {
        PostNode originalPostNode = postNodeRepository.findById(s).orElseThrow(() -> new AppException(404, "Post not found"));
        Post post = new Post(content);
        post = postRepository.save(post);

        PostNode postNode = new PostNode(post.getId(), originalPostNode.getCategories());

        setPostAuthors(postNode, userId, Set.of(userId));
        postNode.setOriginalPost(Optional.ofNullable(originalPostNode.getOriginalPost()).orElse(originalPostNode));
        return postNodeRepository.save(postNode).getPostId();
    }

    @Override
    public PostDetail findPostById(String postId) {
        PostNode postNode = postNodeRepository.findById(postId).orElseThrow(() -> new AppException(404, "Post not found"));
        return null;
    }

    public Map<String, PostDetail> bindPostDetail(List<PostDTO> postNodes) {
        List<String> postIds = collectPostIds(postNodes);
        Set<Long> authorIds = collectPostDTOAuthorIds(postNodes);

        Map<String, Post> posts = postRepository.findByIdIn(postIds).stream()
                .collect(Collectors.toMap(Post::getId, Function.identity()));
        Map<Long, UserDetail> authorsMap = userClient.getUsersByIdsMap(authorIds);
        Map<String, Map<ReactionType, Long>> reactionsMap = reactionNodeRepository.getReactionsForPosts(postIds);

        return postNodes.stream()
                .collect(Collectors.toMap(
                        PostDTO::getPostId,
                        postNode -> createPostDetail(postNode, posts, authorsMap, reactionsMap),
                        (oldValue, newValue) -> oldValue,
                        LinkedHashMap::new
                ));
    }

    private List<String> collectPostIds(List<PostDTO> postNodes) {
        return postNodes.stream()
                .flatMap(postNode -> Stream.of(postNode.getPostId(), postNode.getOriginalPost() != null ? postNode.getOriginalPost().getPostId() : null))
                .filter(Objects::nonNull)
                .toList();
    }

    private Set<Long> collectPostDTOAuthorIds(List<PostDTO> postNodes) {
        return postNodes.stream()
                .flatMap(postNode -> Stream.concat(
                        postNode.getAuthorId().stream(),
                        Optional.ofNullable(postNode.getOriginalPost())
                                .map(PostDTO::getAuthorId)
                                .stream()
                                .flatMap(List::stream)
                ))
                .collect(Collectors.toSet());
    }

    private PostDetail createPostDetail(PostDTO postNode, Map<String, Post> posts, Map<Long, UserDetail> authorsMap, Map<String, Map<ReactionType, Long>> reactionsMap) {
        List<UserDetail> authors = postNode.getAuthorId().stream()
                .map(authorsMap::get)
                .toList();
        return new PostDetail(
                posts.get(postNode.getPostId()),
                authors,
                reactionsMap.get(postNode.getPostId()),
                Optional.ofNullable(postNode.getOriginalPost()).map(originalPost ->
                        new PostDetail(
                                posts.get(originalPost.getPostId()),
                                authors,
                                reactionsMap.get(originalPost.getPostId())
                        )
                ).orElse(null)
        );
    }
}
