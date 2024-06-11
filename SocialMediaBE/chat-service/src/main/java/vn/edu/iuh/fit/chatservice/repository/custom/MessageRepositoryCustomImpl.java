package vn.edu.iuh.fit.chatservice.repository.custom;

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

    @Override
    public List<Message> findByConversationId(String conversationId, int page, int size) {
        int skip = page > 0 ? (page - 1) * size : 0;

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("conversationId").is(conversationId)),
                Aggregation.sort(Sort.Direction.DESC, "createdAt"),
                Aggregation.skip(skip),
                Aggregation.limit(size)
        );

        return mongoTemplate.aggregate(aggregation, Message.class, Message.class).getMappedResults();
    }
}
