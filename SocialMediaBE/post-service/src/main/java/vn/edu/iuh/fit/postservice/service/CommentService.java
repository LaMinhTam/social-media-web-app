package vn.edu.iuh.fit.postservice.service;

import vn.edu.iuh.fit.postservice.dto.SortStrategy;
import vn.edu.iuh.fit.postservice.dto.CommentDetailDTO;

import java.util.List;

public interface CommentService {
    String saveComment(Long id, String postId, String content, List<String> media, List<Long> tags, String parentCommentId);

    List<CommentDetailDTO> getCommentsByPostId(String postId, SortStrategy sortStrategy, int page, int size);
}
