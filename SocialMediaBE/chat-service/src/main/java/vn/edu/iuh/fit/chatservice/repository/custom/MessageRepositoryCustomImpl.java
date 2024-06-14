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

    public List<Message> findMessagesAfterMessageId(String conversationId, String messageId, int size) {
        ObjectId objectId = new ObjectId(messageId);

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("conversationId").is(conversationId).and("id").lt(objectId)),
                Aggregation.sort(Sort.Direction.DESC, "createdAt"),
                Aggregation.limit(size)
        );

        return mongoTemplate.aggregate(aggregation, Message.class, Message.class).getMappedResults();
    }
}
