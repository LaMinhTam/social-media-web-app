package vn.edu.iuh.fit.chatservice.repository.custom;

import org.bson.types.ObjectId;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;

import java.util.Optional;

public interface ConversationRepositoryCustom {
    Optional<Conversation> findByConversationId(ObjectId objectId);
}
