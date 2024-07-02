package vn.edu.iuh.fit.postservice.repository.neo4j;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import vn.edu.iuh.fit.postservice.entity.neo4j.PostNode;
import vn.edu.iuh.fit.postservice.repository.neo4j.custom.CustomPostNodeRepository;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface PostNodeRepository extends Neo4jRepository<PostNode, String>, CustomPostNodeRepository {
    List<PostNode> findByAuthorsUserId(Long userId);

    List<PostNode> findByPostIdIn(List<String> postIds);

    Page<PostNode> findByAuthorsUserIdIn(Set<Long> friendUserIds, PageRequest friendPageRequest);

//    @Query(value = "MATCH (u:`UserNode`)-[:`AUTHORED_BY`]->(p:`PostNode`) " +
//            "OPTIONAL MATCH (p)<-[:`REACTION`]-(r:`ReactionNode`) " +
//            "WITH p, count(r) AS reactionCount, date(substring(p.createdAt, 0, 10)) AS createdAtDay " +
//            "ORDER BY createdAtDay DESC, reactionCount DESC " +
//            "RETURN createdAtDay, collect(p) AS posts")
//    List<Map<String, Object>> findPostsByReactionCount();
}
