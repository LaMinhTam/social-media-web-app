package vn.edu.iuh.fit.chatservice.service.impl;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationStatus;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.exception.AppException;
import vn.edu.iuh.fit.chatservice.repository.ConversationRepository;
import vn.edu.iuh.fit.chatservice.service.ConversationService;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ConversationServiceImpl implements ConversationService {
    private final ConversationRepository conversationRepository;

    public ConversationServiceImpl(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
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
}
