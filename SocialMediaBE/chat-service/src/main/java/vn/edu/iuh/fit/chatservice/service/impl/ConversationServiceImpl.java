package vn.edu.iuh.fit.chatservice.service.impl;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.chatservice.dto.ConversationSettingsRequest;
import vn.edu.iuh.fit.chatservice.dto.SimpleConversationDTO;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationStatus;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.exception.AppException;
import vn.edu.iuh.fit.chatservice.repository.ConversationRepository;
import vn.edu.iuh.fit.chatservice.repository.MessageRepository;
import vn.edu.iuh.fit.chatservice.service.ConversationService;

import java.util.*;

@Service
public class ConversationServiceImpl implements ConversationService {
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public ConversationServiceImpl(ConversationRepository conversationRepository, MessageRepository messageRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    public String createPrivateConversation(List<Long> members) {
        Conversation conversation = Conversation.builder()
                .members(members)
                .createdAt(new Date())
                .updatedAt(new Date())
                .type(ConversationType.PRIVATE)
                .build();
        Optional<Conversation> optionalConversation = conversationRepository.findConversationByMembersAndType(members, ConversationType.PRIVATE);

        return optionalConversation
                .map(existConversation -> existConversation.getId().toHexString())
                .orElseGet(() -> {
                    Conversation savedConversation = conversationRepository.save(conversation);
                    return savedConversation.getId().toHexString();
                });
    }

    public String createGroupConversation(Long id, String name, String image, List<Long> members) {
        Conversation conversation = Conversation.builder()
                .name(name)
                .avatar(image)
                .ownerId(id)
                .settings(new ConversationSettings())
                .type(ConversationType.GROUP)
                .status(ConversationStatus.ACTIVE)
                .members(members)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();
        Conversation savedConversation = conversationRepository.save(conversation);
        return savedConversation.getId().toHexString();
    }

    @Override
    public String createConversation(Long id, String name, String image, List<Long> members, ConversationType conversationType) {
        if (conversationType.equals(ConversationType.PRIVATE)) {
            return createPrivateConversation(members);
        } else {
            return createGroupConversation(id, name, image, members);
        }
    }

    @Override
    public Conversation getConversation(Long userId, String conversationId) {
        return conversationRepository.findById(new ObjectId(conversationId), userId).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found or you are not a member of this conversation"));
    }

    @Override
    public List<Conversation> findConversationsByUserId(Long id) {
        return conversationRepository.findByMembersAndStatus(List.of(id), ConversationStatus.ACTIVE);
    }

    @Override
    public void disbandConversation(Long userId, String conversationId) {
        Conversation conversation = conversationRepository.findById(new ObjectId(conversationId), userId).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found or you are not a member of this conversation"));
        if (conversation.getType().equals(ConversationType.PRIVATE)) {
            throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "You can not disband a private conversation");
        } else if (!conversation.getOwnerId().equals(userId)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not the owner of this conversation");
        } else {
            conversation.setStatus(ConversationStatus.DISBAND);
            conversationRepository.save(conversation);
        }
    }

    @Override
    public SimpleConversationDTO kickMember(Long adminId, String conversationId, Long memberId) {
        Conversation conversation = validateConversationAndAdmin(conversationId, adminId);
        if (!conversation.getMembers().contains(memberId)) {
            throw new AppException(HttpStatus.NOT_FOUND.value(), "Member not found in this conversation");
        }
        Message message = Message.builder()
                .conversationId(conversationId)

                .content("You have been kicked from this conversation")
                .createdAt(new Date())
                .updatedAt(new Date())
                .type(MessageType.NOTIFICATION)
                .build();
        conversation.getMembers().remove(memberId);
        return saveAndReturnDTO(conversation);
    }

    @Override
    public SimpleConversationDTO grantDeputy(Long adminId, String conversationId, Long memberId) {
        Conversation conversation = validateConversationAndAdmin(conversationId, adminId);
        if (!conversation.getMembers().contains(memberId)) {
            throw new AppException(HttpStatus.NOT_FOUND.value(), "Member not found in this conversation");
        }
        conversation.getDeputies().add(memberId);
        return saveAndReturnDTO(conversation);
    }

    @Override
    public SimpleConversationDTO revokeDeputy(Long adminId, String conversationId, Long memberId) {
        Conversation conversation = validateConversationAndAdmin(conversationId, adminId);
        if (!conversation.getMembers().contains(memberId)) {
            throw new AppException(HttpStatus.NOT_FOUND.value(), "Member not found in this conversation");
        }
        conversation.getDeputies().remove(memberId);

        return saveAndReturnDTO(conversation);
    }

    @Override
    public ConversationSettings updateConversationSettings(Long adminId, String conversationId, ConversationSettingsRequest settings) {
        Conversation conversation = conversationRepository.findById(new ObjectId(conversationId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found"));
        String linkToJoinGroup = settings.isJoinByLink() ? UUID.randomUUID().toString() : "";
        ConversationSettings newSettings = new ConversationSettings(
                settings.isConfirmNewMember(),
                settings.isRestrictedMessaging(),
                settings.isAllowDeputySendMessages(),
                settings.isJoinByLink(),
                linkToJoinGroup,
                settings.isAllowMemberToChangeGroupInfo(),
                settings.isAllowDeputyToInviteMember(),
                settings.isAllowMemberToInviteMember(),
                settings.isAllowDeputyRemoveMember(),
                settings.isAllowDeputyChangeGroupInfo(),
                settings.isAllowMemberToPinMessage(),
                settings.isAllowDeputyPromoteMember(),
                settings.isAllowDeputyDemoteMember()
        );
        conversation.setSettings(newSettings);
        return conversationRepository.save(conversation).getSettings();
    }

    private Conversation validateConversationAndAdmin(String conversationId, Long adminId) {
        Conversation conversation = conversationRepository.findById(new ObjectId(conversationId), adminId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found or you are not a member of this conversation"));
        if (!conversation.getOwnerId().equals(adminId)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not the owner of this conversation");
        }
        return conversation;
    }

    private SimpleConversationDTO saveAndReturnDTO(Conversation conversation) {
        Conversation savedConversation = conversationRepository.save(conversation);
        return new SimpleConversationDTO(savedConversation);
    }
}
