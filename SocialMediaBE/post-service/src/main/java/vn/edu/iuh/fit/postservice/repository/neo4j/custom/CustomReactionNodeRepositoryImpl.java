package vn.edu.iuh.fit.postservice.repository.neo4j.custom;

import org.springframework.data.neo4j.core.Neo4jTemplate;
import vn.edu.iuh.fit.postservice.entity.neo4j.PostNode;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionNode;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionType;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CustomReactionNodeRepositoryImpl implements CustomReactionNodeRepository {
    private final Neo4jTemplate neo4jTemplate;

    public CustomReactionNodeRepositoryImpl(Neo4jTemplate neo4jTemplate) {
        this.neo4jTemplate = neo4jTemplate;
    }

    @Override
    public List<ReactionNode> findByPostNode(PostNode postNode) {
        return neo4jTemplate.findAll(
                "MATCH (r:ReactionNode)-[:REACTED_ON_POST]->(p:PostNode {postId: $postId}) RETURN r",
                Map.of("postId", postNode.getPostId()),
                ReactionNode.class
        );
    }

    @Override
    public Map<String, Map<ReactionType, Long>> getReactionsForPosts(List<String> postIds) {
        String query = "MATCH (r:ReactionNode)-[:REACTION]->(p:PostNode) WHERE p.postId IN $postIds RETURN r, p";
        return neo4jTemplate.findAll(query, Map.of("postIds", postIds), ReactionNode.class)
                .stream()
                .collect(Collectors.groupingBy(
                        ReactionNode::getTargetId,
                        Collectors.groupingBy(
                                ReactionNode::getType,
                                Collectors.counting()
                        )
                ));
    }

    @Override
    public Map<String, Map<ReactionType, Long>> getReactionsForComments(List<String> commentIds) {
        String query = "MATCH (r:ReactionNode)-[:REACTION]->(c:CommentNode) WHERE c.commentId IN $commentIds RETURN r, c";
        return neo4jTemplate.findAll(query, Map.of("commentIds", commentIds), ReactionNode.class)
                .stream()
                .collect(Collectors.groupingBy(
                        ReactionNode::getTargetId,
                        Collectors.groupingBy(
                                ReactionNode::getType,
                                Collectors.counting()
                        )
                ));
    }

}
