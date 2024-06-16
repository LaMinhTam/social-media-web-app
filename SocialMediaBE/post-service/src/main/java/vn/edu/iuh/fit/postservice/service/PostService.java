package vn.edu.iuh.fit.postservice.service;

import vn.edu.iuh.fit.postservice.dto.PostDetail;

import java.util.List;
import java.util.Map;

public interface PostService {
    List<PostDetail> findPostsByUserId(Long userId);

    String savePost(Long userId, List<Long> coAuthor, String content, List<String> media);


    Map<String, PostDetail> findUserWall(Long userId, int page, int size);

    Map<String, PostDetail> findNewFeed(Long userId, int page, int size);
}
