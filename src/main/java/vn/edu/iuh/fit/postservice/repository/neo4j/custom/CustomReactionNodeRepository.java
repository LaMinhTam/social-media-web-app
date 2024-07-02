package vn.edu.iuh.fit.postservice.repository.neo4j.custom;

import vn.edu.iuh.fit.postservice.entity.neo4j.PostNode;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionNode;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionType;

import java.util.List;
import java.util.Map;

public interface CustomReactionNodeRepository {
    List<ReactionNode> findByPostNode(PostNode postNode);

    Map<String, Map<ReactionType, Long>> getReactionsForPosts(List<String> postIds);

    Map<String, Map<ReactionType, Long>> getReactionsForComments(List<String> commentIds);
}
