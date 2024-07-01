package vn.edu.iuh.fit.userservice.entity;

import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.RelationshipId;

import java.util.Date;
import java.util.Objects;

@Node("FriendRelationship")
public class FriendRelationship {
    @RelationshipId
    private Long id;
    private Date createdAt;
    private Date updatedAt;

    @Property("targetUser")
    private Long targetUser;
    @Property("sourceUser")
    private Long sourceUser;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FriendRelationship that = (FriendRelationship) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public FriendRelationship() {
    }

    public FriendRelationship(Long id, Date createdAt, Date updatedAt, Long targetUser, Long sourceUser) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.targetUser = targetUser;
        this.sourceUser = sourceUser;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(Long targetUser) {
        this.targetUser = targetUser;
    }

    public Long getSourceUser() {
        return sourceUser;
    }

    public void setSourceUser(Long sourceUser) {
        this.sourceUser = sourceUser;
    }
}