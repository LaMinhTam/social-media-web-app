package vn.edu.iuh.fit.postservice.repository.neo4j.custom;

import org.neo4j.cypherdsl.core.Cypher;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import vn.edu.iuh.fit.postservice.entity.neo4j.CommentNode;

import java.util.List;
import java.util.Map;

public class CustomCommentNodeRepositoryImpl implements CustomCommentNodeRepository {
    private final Neo4jTemplate neo4jTemplate;

    public CustomCommentNodeRepositoryImpl(Neo4jTemplate neo4jTemplate) {
        this.neo4jTemplate = neo4jTemplate;
    }

    @Override
    public List<CommentNode> findCommentsByPostId(String postId) {
        String query = "MATCH (p:PostNode {postId: $postId})<-[:COMMENT_ON]-(c:CommentNode) " +
                "RETURN c";

        return neo4jTemplate.findAll(query, Map.of("postId", postId), CommentNode.class);
    }
}
