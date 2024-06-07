package vn.edu.iuh.fit.chatservice.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.repository.custom.MessageRepositoryCustom;

public interface MessageRepository extends MongoRepository<Message, String>, MessageRepositoryCustom {
}
