package vn.edu.iuh.fit.postservice.entity.neo4j;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Node
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryNode {
    @Id
    @GeneratedValue
    private Long id;
    private Category category;
    private String description;
    @Relationship(type = "BELONG_TO", direction = Relationship.Direction.INCOMING)
    private Set<PostNode> posts = new HashSet<>();

    @Relationship(type = "INTERESTED_IN", direction = Relationship.Direction.INCOMING)
    private Set<UserCategoryInterest> userInterests = new HashSet<>();

    public CategoryNode(Category category, String description) {
        this.category = category;
        this.description = description;
    }
}
