package vn.edu.iuh.fit.chatservice.repository.custom;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;

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
}
