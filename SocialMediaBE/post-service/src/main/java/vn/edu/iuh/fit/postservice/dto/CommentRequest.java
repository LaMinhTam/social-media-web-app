package vn.edu.iuh.fit.postservice.dto;

import java.util.List;

public record CommentRequest(String postId, String content, List<String> media, List<Long> tags, String parentCommentId) {
}
