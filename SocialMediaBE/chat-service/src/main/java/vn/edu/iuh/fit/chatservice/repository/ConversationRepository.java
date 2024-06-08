package vn.edu.iuh.fit.chatservice.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.repository.custom.ConversationRepositoryCustom;

import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String>, ConversationRepositoryCustom {
    @Query("{ '_id' : ?0 }")
    //notice about user must in the conversation and disbanded, then dont need to validate
    public Optional<Conversation> findById(ObjectId id);
}
