package vn.edu.iuh.fit.postservice.entity.neo4j;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Node
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostNode {
    @Id
    private String postId;
    private Date createdAt;
    private Date updatedAt;
    @Relationship(type = "AUTHORED_BY", direction = Relationship.Direction.INCOMING)
    private Set<UserNode> authors = new HashSet<>();
    @Relationship(type = "TAGGED", direction = Relationship.Direction.OUTGOING)
    private Set<UserNode> taggedUsers = new HashSet<>();
    @Relationship(type = "COMMENT_ON", direction = Relationship.Direction.INCOMING)
    private Set<CommentNode> comments = new HashSet<>();
    @Relationship(type = "SHARE_OF", direction = Relationship.Direction.OUTGOING)
    private PostNode originalPost;
    @Relationship(type = "REACTION", direction = Relationship.Direction.INCOMING)
    private Set<ReactionNode> reactions = new HashSet<>();

    public PostNode(String id) {
        this.postId = id;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PostNode postNode = (PostNode) o;
        return Objects.equals(postId, postNode.postId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(postId);
    }

    @Override
    public String toString() {
        return "PostNode{" +
                "postId='" + postId + '\'' +
                '}';
    }
}
