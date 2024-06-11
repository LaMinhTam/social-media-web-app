package vn.edu.iuh.fit.chatservice.service;

import vn.edu.iuh.fit.chatservice.dto.MessageDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageFromClientDTO;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;

import java.util.List;

public interface MessageService {
    Message saveMessage(Long userId, MessageFromClientDTO message) throws Exception;

    List<MessageDTO> getMessagesByConversationId(String conversationId, int page, int size);

    MessageDTO revokeMessage(String messageId) ;

    List<MessageDTO> shareMessage(Long senderId, String messageId, List<String> conversationIds);

    MessageDTO reactMessage(Long senderId, String messageId, ReactionType reaction);
}
