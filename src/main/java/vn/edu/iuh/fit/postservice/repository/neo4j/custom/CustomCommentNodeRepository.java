package vn.edu.iuh.fit.postservice.repository.neo4j.custom;

import vn.edu.iuh.fit.postservice.entity.neo4j.CommentNode;

import java.util.List;

public interface CustomCommentNodeRepository {
    List<CommentNode> findCommentsByPostId(String postId);
}
