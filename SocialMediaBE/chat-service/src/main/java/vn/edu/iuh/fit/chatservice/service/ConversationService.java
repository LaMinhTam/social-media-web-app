package vn.edu.iuh.fit.chatservice.service;

import vn.edu.iuh.fit.chatservice.dto.ConversationSettingsRequest;
import vn.edu.iuh.fit.chatservice.dto.SimpleConversationDTO;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;

import java.util.List;

public interface ConversationService {
    String createConversation(Long id, String name, String image, List<Long> members, ConversationType conversationType);

    Conversation getConversation(Long userId, String conversationId) ;

    List<Conversation> findConversationsByUserId(Long id);

    void disbandConversation(Long userId, String conversationId) ;

    SimpleConversationDTO kickMember(Long adminId, String conversationId, Long memberId);

    SimpleConversationDTO grantDeputy(Long adminId, String conversationId, Long memberId);

    SimpleConversationDTO revokeDeputy(Long adminId, String conversationId, Long memberId);

    ConversationSettings updateConversationSettings(Long adminId, String conversationId, ConversationSettingsRequest settings);
}
