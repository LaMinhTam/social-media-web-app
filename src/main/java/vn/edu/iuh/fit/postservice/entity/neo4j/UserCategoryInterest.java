package vn.edu.iuh.fit.postservice.entity.neo4j;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.*;

import java.time.LocalDateTime;

@RelationshipProperties
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCategoryInterest {
    @Id
    @GeneratedValue
    private Long id;
    private double score;
    private LocalDateTime lastUpdated;

    @TargetNode
    private CategoryNode category;

    @Relationship(type = "INTERESTED_IN", direction = Relationship.Direction.INCOMING)
    private UserNode user;

    public void updateScore(double interactionScore) {
        this.score += interactionScore;
        this.lastUpdated = LocalDateTime.now();
    }
}