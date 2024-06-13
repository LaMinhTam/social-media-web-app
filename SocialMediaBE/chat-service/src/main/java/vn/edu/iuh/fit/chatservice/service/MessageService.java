package vn.edu.iuh.fit.chatservice.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.fit.chatservice.dto.MessageDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageDetailDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageFromClientDTO;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;

import java.util.List;

public interface MessageService {
    Message saveMessage(Long userId, MessageFromClientDTO message);

    List<MessageDetailDTO> getMessagesByConversationId(Conversation conversationId, int page, int size);

    MessageDTO revokeMessage(String messageId) ;

    List<MessageDTO> shareMessage(Long senderId, String messageId, List<String> conversationIds);

    MessageDTO reactMessage(Long senderId, String messageId, ReactionType reaction);

    void markMessageAsRead(Long id, ObjectId messageId);
}
