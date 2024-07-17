package vn.edu.iuh.fit.chatservice.repository.custom;

import org.bson.types.ObjectId;
import vn.edu.iuh.fit.chatservice.entity.message.Message;

import java.util.List;
import java.util.Map;

public interface MessageRepositoryCustom  {
    List<Message> findMessagesAfterMessageId(Long userId, String conversationId, String messageId,  int size);

    public Map<String, Message> findLastMessagesByConversationIdIn(Long userId, List<String> conversationIds);
}
