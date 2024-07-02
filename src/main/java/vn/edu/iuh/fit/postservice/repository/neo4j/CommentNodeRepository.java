package vn.edu.iuh.fit.postservice.repository.neo4j;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import vn.edu.iuh.fit.postservice.entity.neo4j.CommentNode;
import vn.edu.iuh.fit.postservice.entity.neo4j.PostNode;
import vn.edu.iuh.fit.postservice.repository.neo4j.custom.CustomCommentNodeRepository;

import java.util.List;

public interface CommentNodeRepository extends Neo4jRepository<CommentNode, String>, CustomCommentNodeRepository {
    List<CommentNode> findByPostNode(PostNode postNode);
}
