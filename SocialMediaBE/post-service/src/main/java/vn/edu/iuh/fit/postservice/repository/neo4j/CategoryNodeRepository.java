package vn.edu.iuh.fit.postservice.repository.neo4j;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import vn.edu.iuh.fit.postservice.entity.neo4j.Category;
import vn.edu.iuh.fit.postservice.entity.neo4j.CategoryNode;

import java.util.List;
import java.util.Set;

public interface CategoryNodeRepository extends Neo4jRepository<CategoryNode, Long> {
    public Set<CategoryNode> findByCategoryIn(Set<Category> categories);
}
