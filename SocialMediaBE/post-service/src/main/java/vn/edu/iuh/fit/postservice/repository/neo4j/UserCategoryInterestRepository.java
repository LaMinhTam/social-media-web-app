package vn.edu.iuh.fit.postservice.repository.neo4j;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import vn.edu.iuh.fit.postservice.entity.neo4j.CategoryNode;
import vn.edu.iuh.fit.postservice.entity.neo4j.UserCategoryInterest;
import vn.edu.iuh.fit.postservice.entity.neo4j.UserNode;

import java.util.Optional;

public interface UserCategoryInterestRepository extends Neo4jRepository<UserCategoryInterest, Long> {
    Optional<UserCategoryInterest> findByUserAndCategory(UserNode user, CategoryNode category);
}
