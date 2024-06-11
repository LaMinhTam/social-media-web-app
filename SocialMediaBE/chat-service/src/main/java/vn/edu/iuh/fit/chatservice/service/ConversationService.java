package vn.edu.iuh.fit.chatservice.service;

import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;

import java.util.List;

public interface ConversationService {
    String createConversation(Long id, String name, String image, List<Long> members, ConversationType conversationType);

    Conversation getConversation(Long userId, String conversationId) ;

    List<Conversation> findConversationsByUserId(Long id);

    void disbandConversation(Long userId, String conversationId) ;
}
