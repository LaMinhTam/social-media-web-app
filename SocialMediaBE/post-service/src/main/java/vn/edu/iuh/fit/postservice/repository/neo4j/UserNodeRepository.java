package vn.edu.iuh.fit.postservice.repository.neo4j;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import vn.edu.iuh.fit.postservice.entity.neo4j.UserNode;

public interface UserNodeRepository extends Neo4jRepository<UserNode, Long> {
}
