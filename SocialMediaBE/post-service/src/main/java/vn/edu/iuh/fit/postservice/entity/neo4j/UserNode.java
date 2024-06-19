package vn.edu.iuh.fit.postservice.entity.neo4j;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Node
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserNode {
    @Id
    private Long userId;
    @Relationship(type = "POSTED", direction = Relationship.Direction.OUTGOING)
    private Set<PostNode> posts = new HashSet<>();
    @Relationship(type = "COMMENTED_BY", direction = Relationship.Direction.INCOMING)
    private Set<CommentNode> comments = new HashSet<>();
    @Relationship(type = "TAGGED_IN", direction = Relationship.Direction.OUTGOING)
    private Set<PostNode> taggedPosts = new HashSet<>();
    @Relationship(type = "REACTED_BY", direction = Relationship.Direction.INCOMING)
    private Set<ReactionNode> reactions = new HashSet<>();
    @Relationship(type = "FOLLOW", direction = Relationship.Direction.INCOMING)
    private Set<UserNode> followers = new HashSet<>();
    @Relationship(type = "FOLLOW", direction = Relationship.Direction.OUTGOING)
    private Set<UserNode> following = new HashSet<>();
    @Relationship(type = "REACH", direction = Relationship.Direction.OUTGOING)
    private Set<PostNode> reach = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserNode userNode = (UserNode) o;
        return Objects.equals(userId, userNode.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

    public UserNode(Long id) {
        this.userId = id;
    }

    @Override
    public String toString() {
        return "UserNode{" +
                "userId=" + userId +
                '}';
    }
}