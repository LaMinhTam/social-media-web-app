package vn.edu.iuh.fit.chatservice.repository.custom;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationStatus;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;

import java.util.List;
import java.util.Optional;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

public class ConversationRepositoryCustomImpl implements ConversationRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    public ConversationRepositoryCustomImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Optional<Conversation> findByConversationId(ObjectId objectId) {
        return mongoTemplate.query(Conversation.class).matching(query(where("_id").is(objectId))).first();
    }

    @Override
    public List<Conversation> findByMembersAndStatus(List<Long> id, ConversationStatus status) {
        return mongoTemplate.query(Conversation.class)
                .matching(query(where("members").in(id).and("status").is(status)))
                .all();
    }

    @Override
    public Optional<Conversation> findConversationByMembersAndType(List<Long> members, ConversationType type) {
        return mongoTemplate.query(Conversation.class)
                .matching(query(where("members").all(members).and("type").is(type)))
                .first();
    }

    @Override
    public Optional<Conversation> findById(ObjectId id, Long userId) {
        return mongoTemplate.query(Conversation.class)
                .matching(
                        query(
                                where("_id").is(id)
                                        .and("members").in(List.of(userId))
                                        .and("status").ne(ConversationStatus.DISBAND)
                        )
                )
                .first();
    }

    @Override
    public Optional<Conversation> findByLink(String link) {
        return mongoTemplate.query(Conversation.class)
                .matching(query(where("settings.linkToJoinGroup").is(link)))
                .first();
    }
}