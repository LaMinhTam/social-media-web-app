package vn.edu.iuh.fit.chatservice.repository.custom;

import org.springframework.data.mongodb.core.MongoTemplate;

public class MessageRepositoryCustomImpl implements MessageRepositoryCustom{
    private final MongoTemplate mongoTemplate;

    public MessageRepositoryCustomImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
}
