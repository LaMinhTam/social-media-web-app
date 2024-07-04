package vn.edu.iuh.fit.postservice.service;

import vn.edu.iuh.fit.postservice.dto.PostDetail;
import vn.edu.iuh.fit.postservice.entity.neo4j.Category;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface PostService {
    List<PostDetail> findPostsByUserId(Long userId);

    String savePost(Long userId, List<Long> coAuthor, String content, List<String> media, Set<Category> categories);


    Map<String, PostDetail> findUserWall(Long userId, int page, int size);

    Map<String, PostDetail> findNewFeed(Long userId, int page, int size);

    String sharePost(Long userId, String s, String content);

    PostDetail findPostById(String postId);
}
