package vn.edu.iuh.fit.chatservice.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.repository.custom.MessageRepositoryCustom;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends MongoRepository<Message, ObjectId>, MessageRepositoryCustom {
    @Query("{ '_id' : ?0 }")
    public Optional<Message> findById(ObjectId id);

    List<Message> findMessagesByIdIn(List<ObjectId> replyToMessageIds);

    List<Message> findMessagesByReplyToMessageId(String replyToMessageId);
}
