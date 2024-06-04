package vn.edu.iuh.fit.userservice.repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import vn.edu.iuh.fit.userservice.entity.FriendRelationship;
import vn.edu.iuh.fit.userservice.entity.FriendType;
import vn.edu.iuh.fit.userservice.repository.custom.CustomFriendRepository;

public interface FriendRepository extends Neo4jRepository<FriendRelationship, Long>, CustomFriendRepository {

    @Query("match (f:FriendRelationship) where id(f) = $id set f.status = $status return f")
    public FriendRelationship updateByIdAndStatus(Long id, FriendType status);
}