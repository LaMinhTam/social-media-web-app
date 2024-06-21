package vn.edu.iuh.fit.chatservice.service;

import vn.edu.iuh.fit.chatservice.dto.ConversationDTO;
import vn.edu.iuh.fit.chatservice.dto.ConversationSettingsRequest;
import vn.edu.iuh.fit.chatservice.dto.SimpleConversationDTO;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;

import java.util.List;

public interface ConversationService {
    String createConversation(Long id, String name, String image, List<Long> members, ConversationType conversationType);

    ConversationDTO getConversation(Long userId, String conversationId);

    Conversation getPlainConversation(Long userId, String conversationId);

    List<ConversationDTO> findConversationsByUserId(Long id);

    Conversation disbandConversation(Long userId, String conversationId);

    SimpleConversationDTO kickMember(Long adminId, String conversationId, Long memberId);

    SimpleConversationDTO grantDeputy(Long adminId, String conversationId, Long memberId);

    SimpleConversationDTO revokeDeputy(Long adminId, String conversationId, Long memberId);

    ConversationSettings updateConversationSettings(Long adminId, String conversationId, ConversationSettingsRequest settings);

    SimpleConversationDTO addMember(Long id, String conversationId, List<Long> memberId);

    ConversationDTO joinByLink(Long id, String link);

    ConversationDTO findByLink(String link);

    Conversation leaveConversation(Long id, String conversationId);

    Conversation changeName(Long id, String conversationId, String name);

    Conversation changeImage(Long id, String conversationId, String image);

    Conversation grantOwner(Long adminId, String conversationId, Long memberId);
}
