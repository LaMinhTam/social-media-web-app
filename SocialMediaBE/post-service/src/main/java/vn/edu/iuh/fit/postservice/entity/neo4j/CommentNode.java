package vn.edu.iuh.fit.postservice.entity.neo4j;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import vn.edu.iuh.fit.postservice.entity.mongo.Post;

import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Node
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentNode {
    @Id
    private String commentId;
    private Date createAt;
    private Date updateAt;
    @Relationship(type = "COMMENTED_BY", direction = Relationship.Direction.INCOMING)
    private UserNode author;
    @Relationship(type = "COMMENT_ON", direction = Relationship.Direction.OUTGOING)
    private PostNode postNode;
    @Relationship(type = "TAGGED", direction = Relationship.Direction.OUTGOING)
    private Set<UserNode> taggedUsers = new HashSet<>();
    @Relationship(type = "COMMENT_ON", direction = Relationship.Direction.OUTGOING)
    private CommentNode parentComment;
    @Relationship(type = "HAS_CHILD", direction = Relationship.Direction.OUTGOING)
    private Set<CommentNode> childComments = new HashSet<>();
    @Relationship(type = "REACTION", direction = Relationship.Direction.INCOMING)
    private Set<ReactionNode> reactions = new HashSet<>();

    public CommentNode(String commentId) {
        this.commentId = commentId;
        this.createAt = new Date();
        this.updateAt = new Date();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CommentNode that = (CommentNode) o;
        return Objects.equals(commentId, that.commentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(commentId);
    }
}