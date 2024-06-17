package vn.edu.iuh.fit.chatservice.repository.custom;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import vn.edu.iuh.fit.chatservice.entity.message.Message;

import java.util.List;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

public class MessageRepositoryCustomImpl implements MessageRepositoryCustom{
    private final MongoTemplate mongoTemplate;

    public MessageRepositoryCustomImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Message> findMessagesAfterMessageId(Long userId, String conversationId, String messageId, int size) {
        Criteria criteria = Criteria.where("conversationId").is(conversationId).and("deletedBy").nin(userId);

        if (messageId != null) {
            ObjectId objectId = new ObjectId(messageId);
            criteria = criteria.and("id").gt(objectId);
        }

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(criteria),
                Aggregation.sort(Sort.Direction.DESC, "createdAt"),
                Aggregation.limit(size)
        );

        return mongoTemplate.aggregate(aggregation, Message.class, Message.class).getMappedResults();
    }

}
