package vn.edu.iuh.fit.postservice.repository.neo4j;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import vn.edu.iuh.fit.postservice.entity.neo4j.UserNode;

public interface UserNodeRepository extends Neo4jRepository<UserNode, Long> {
    @Query("MATCH (u:UserNode {userId: $follower})-[r:FOLLOW]->(f:UserNode {userId: $following}) delete r")
    @Modifying
    void removeFollowing(Long follower, Long following);
}
