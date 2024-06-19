package vn.edu.iuh.fit.postservice.repository.neo4j;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionNode;
import vn.edu.iuh.fit.postservice.repository.neo4j.custom.CustomReactionNodeRepository;

public interface ReactionNodeRepository extends Neo4jRepository<ReactionNode, Long>, CustomReactionNodeRepository {
}
