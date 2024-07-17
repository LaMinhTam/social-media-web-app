package vn.edu.iuh.fit.userservice.repository.custom;

import org.neo4j.cypherdsl.core.Cypher;
import org.neo4j.cypherdsl.core.Functions;
import org.neo4j.cypherdsl.core.Node;
import org.neo4j.cypherdsl.core.Statement;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import vn.edu.iuh.fit.userservice.entity.FriendRelationship;
import vn.edu.iuh.fit.userservice.entity.User;
import vn.edu.iuh.fit.userservice.model.UserModel;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.neo4j.cypherdsl.core.Cypher.node;

public class CustomFriendRepositoryImpl implements CustomFriendRepository {
    private final Neo4jTemplate neo4jTemplate;

    public CustomFriendRepositoryImpl(Neo4jTemplate neo4jTemplate) {
        this.neo4jTemplate = neo4jTemplate;
    }

    @Override
    public Optional<FriendRelationship> findBySenderAndReceiver(Long senderId, Long receiverId) {
        Statement statement = Cypher.match(
                        node("User").named("sender").withProperties("userId", Cypher.parameter("senderId"))
                                .relationshipTo(node("FriendRelationship").named("friend"), "SEND"),
                        node("FriendRelationship").named("friend")
                                .relationshipTo(node("User").named("receiver").withProperties("userId", Cypher.parameter("receiverId")), "RECEIVE")
                )
                .returning("friend")
                .build();

        return neo4jTemplate.findOne(statement, Map.of("senderId", senderId, "receiverId", receiverId), FriendRelationship.class);
    }

    @Override
    public List<UserModel> getSendFriendRequest(Long userId) {
        //MATCH (sender:User)-[s:SEND]->(friend:FriendRelationship)-[r:RECEIVE]->(receiver:User) where sender.userId = 2 return receiver
        Statement statement = Cypher.match(
                        node("User").named("sender").withProperties("userId", Cypher.parameter("userId"))
                                .relationshipTo(node("FriendRelationship").named("friend"), "SEND"),
                        node("FriendRelationship").named("friend")
                                .relationshipTo(node("User").named("receiver"), "RECEIVE")
                )
                .returning("receiver")
                .build();

        List<User> users = neo4jTemplate.findAll(statement, Map.of("userId", userId), User.class);
        return UserModel.convertToUserModel(users);
    }

    @Override
    public List<UserModel> getReceiveFriendRequest(Long userId) {
        Statement statement = Cypher.match(
                        node("User").named("receiver").withProperties("userId", Cypher.parameter("userId"))
                                .relationshipFrom(node("FriendRelationship").named("friend"), "RECEIVE"),
                        node("FriendRelationship").named("friend")
                                .relationshipFrom(node("User").named("sender"), "SEND")
                )
                .returning("sender")
                .build();

        List<User> users = neo4jTemplate.findAll(statement, Map.of("userId", userId), User.class);
        return UserModel.convertToUserModel(users);
    }

    @Override
    public List<UserModel> getBlocked(Long userId) {
        //MATCH (block:User)-[B:BLOCK]->(friend:FriendRelationship)-[BB:`BLOCKED-BY`]->(blocked:User) where block.userId = 2 return blocked
        Statement statement = Cypher.match(
                        node("User").named("block").withProperties("userId", Cypher.parameter("userId"))
                                .relationshipTo(node("FriendRelationship").named("friend"), "BLOCK"),
                        node("FriendRelationship").named("friend")
                                .relationshipTo(node("User").named("blocked"), "BLOCKED-BY")
                )
                .returning("blocked")
                .build();

        List<User> users = neo4jTemplate.findAll(statement, Map.of("userId", userId), User.class);
        return UserModel.convertToUserModel(users);
    }

    @Override
    public Optional<FriendRelationship> findBySenderAndFriendRequest(Long senderId, Long friendRequestId, String relationshipType) {
        Node f = node("FriendRelationship").named("f");
        Statement statement = Cypher.match(node("User").named("sender").withProperties("userId", Cypher.parameter("senderId"))
                        .relationshipTo(f, relationshipType))
                .where(Functions.id(f).eq(Cypher.literalOf(friendRequestId)))
                .returning(f)
                .build();

        return neo4jTemplate.findOne(statement, Map.of("senderId", senderId, "friendRequestId", friendRequestId), FriendRelationship.class);
    }

    @Override
    public List<UserModel> getFriend(Long userId) {
        //MATCH (me:User)-[:FRIEND]->(friend:FriendRelationship)<-[:FRIEND]-(other:User) where me.userId = 2 return other
        Statement statement = Cypher.match(
                        node("User").named("me").withProperties("userId", Cypher.parameter("userId"))
                                .relationshipTo(node("FriendRelationship").named("friend"), "FRIEND"),
                        node("User").named("other")
                                .relationshipTo(node("FriendRelationship").named("friend"), "FRIEND")
                )
                .returning("other")
                .build();
        List<User> users = neo4jTemplate.findAll(statement, Map.of("userId", userId), User.class);
        return UserModel.convertToUserModel(users);
    }


}
