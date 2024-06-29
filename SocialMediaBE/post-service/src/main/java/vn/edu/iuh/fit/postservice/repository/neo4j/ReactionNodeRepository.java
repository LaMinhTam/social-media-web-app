package vn.edu.iuh.fit.postservice.repository.neo4j;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionNode;
import vn.edu.iuh.fit.postservice.repository.neo4j.custom.CustomReactionNodeRepository;

import java.time.LocalDateTime;

public interface ReactionNodeRepository extends Neo4jRepository<ReactionNode, Long>, CustomReactionNodeRepository {
    @Query("MATCH (r:ReactionNode)-[:REACTION_ON]->(p:PostNode)-[:BELONG_TO]->(c:CategoryNode) " +
            "WHERE c.id = $categoryId AND r.createdAt >= datetime($since) " +
            "RETURN count(r)")
    long countReactionsByCategorySince(@Param("categoryId") Long categoryId, @Param("since") LocalDateTime since);
}
