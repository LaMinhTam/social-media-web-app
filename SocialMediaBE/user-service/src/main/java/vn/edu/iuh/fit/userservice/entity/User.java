package vn.edu.iuh.fit.userservice.entity;

import jakarta.validation.constraints.Email;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.schema.RelationshipId;

import java.util.ArrayList;
import java.util.List;

@Node("User")
public class User {
    @RelationshipId
    private Long id;
    private Long userId;
    private String name;
    @Email
    private String email;
    private String imageUrl;
    private String cover;
    @Relationship(type = "SEND", direction = Relationship.Direction.OUTGOING)
    private List<FriendRelationship> sentRequests = new ArrayList<>();
    @Relationship(type = "RECEIVE", direction = Relationship.Direction.INCOMING)
    private List<FriendRelationship> receivedRequests = new ArrayList<>();
    @Relationship(type = "FRIEND", direction = Relationship.Direction.OUTGOING)
    private List<FriendRelationship> friends = new ArrayList<>();
    @Relationship(type = "BLOCK", direction = Relationship.Direction.OUTGOING)
    private List<FriendRelationship> blocked = new ArrayList<>();
    @Relationship(type = "BLOCKED-BY", direction = Relationship.Direction.INCOMING)
    private List<FriendRelationship> blockedBy = new ArrayList<>();

    public User() {
    }

    public User(Long userId, String name, String email, String imageUrl, String cover) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
        this.cover = cover;
    }

    public User(Long id, Long userId, String name, String email, String imageUrl, String cover, List<FriendRelationship> sentRequests, List<FriendRelationship> receivedRequests, List<FriendRelationship> friends, List<FriendRelationship> blocked, List<FriendRelationship> blockedBy) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
        this.cover = cover;
        this.sentRequests = sentRequests;
        this.receivedRequests = receivedRequests;
        this.friends = friends;
        this.blocked = blocked;
        this.blockedBy = blockedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<FriendRelationship> getSentRequests() {
        return sentRequests;
    }

    public void setSentRequests(List<FriendRelationship> sentRequests) {
        this.sentRequests = sentRequests;
    }

    public List<FriendRelationship> getReceivedRequests() {
        return receivedRequests;
    }

    public void setReceivedRequests(List<FriendRelationship> receivedRequests) {
        this.receivedRequests = receivedRequests;
    }

    public List<FriendRelationship> getFriends() {
        return friends;
    }

    public void setFriends(List<FriendRelationship> friends) {
        this.friends = friends;
    }

    public List<FriendRelationship> getBlocked() {
        return blocked;
    }

    public void setBlocked(List<FriendRelationship> blocked) {
        this.blocked = blocked;
    }

    public List<FriendRelationship> getBlockedBy() {
        return blockedBy;
    }

    public void setBlockedBy(List<FriendRelationship> blockedBy) {
        this.blockedBy = blockedBy;
    }
}