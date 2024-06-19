package vn.edu.iuh.fit.chatservice.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.fit.chatservice.dto.*;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;
import vn.edu.iuh.fit.chatservice.model.UserDetail;

import java.util.List;
import java.util.Map;

public interface MessageService {
    Message saveMessage(Long userId, MessageFromClientDTO message);

    List<MessageDetailDTO> getMessagesByConversationId(Long userId, Conversation conversationId, String messageId, int size);

    MessageDTO revokeMessage(Long senderId, String messageId) ;

    List<MessageDTO> shareMessage(Long senderId, String messageId, List<String> conversationIds);

    MessageDTO reactMessage(Long senderId, String messageId, ReactionType reaction);

    void markMessageAsRead(Long id, ObjectId messageId);

    void deleteMessage(Long id, String messageId);

    ReplyMessageDTO getPlainMessage(Long id, String messageId);

    Map<String, List<ReactionDetail>> getReactions(Long id, String messageId);
}
