package vn.edu.iuh.fit.postservice.entity.neo4j;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Objects;

@Node
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReactionNode {
    @Id
    @GeneratedValue
    private Long id;
    private String targetId;
    private ReactionType type;
    @Relationship(type = "REACTED_BY", direction = Relationship.Direction.INCOMING)
    private UserNode user;
    @Relationship(type = "REACTION", direction = Relationship.Direction.OUTGOING)
    private PostNode post;
    @Relationship(type = "REACTION", direction = Relationship.Direction.OUTGOING)
    private CommentNode comment;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReactionNode that = (ReactionNode) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}