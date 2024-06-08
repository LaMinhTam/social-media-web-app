package vn.edu.iuh.fit.chatservice.repository.custom;

import org.bson.types.ObjectId;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationStatus;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;

import java.util.List;
import java.util.Optional;

public interface ConversationRepositoryCustom {
    Optional<Conversation> findByConversationId(ObjectId objectId);

    List<Conversation> findByMembersAndStatus(List<Long> id, ConversationStatus status);

    Optional<Conversation> findConversationByMembersAndType(List<Long> members, ConversationType type);

    public Optional<Conversation> findById(ObjectId id, Long userId);
}
