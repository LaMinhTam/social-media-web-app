package vn.edu.iuh.fit.chatservice.service.impl;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.chatservice.dto.MessageFromClientDTO;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationStatus;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;
import vn.edu.iuh.fit.chatservice.exception.AppException;
import vn.edu.iuh.fit.chatservice.repository.ConversationRepository;
import vn.edu.iuh.fit.chatservice.repository.MessageRepository;
import vn.edu.iuh.fit.chatservice.dto.MessageDTO;
import vn.edu.iuh.fit.chatservice.service.MessageService;

import java.util.*;

@Service
public class MessageServiceImpl implements MessageService {
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    public MessageServiceImpl(MessageRepository messageRepository, ConversationRepository conversationRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    @Override
    public Message saveMessage(Long userId, MessageFromClientDTO messageDTO) {
        Message.MessageBuilder messageBuilder = Message.builder();
        if (!messageDTO.type().equals(MessageType.TEST)) {
            Conversation conversation = conversationRepository.findById(new ObjectId(messageDTO.conversationId()), userId)
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found or you are not a member of this conversation"));
            if (conversation.getType().equals(ConversationType.GROUP)) {
                if (conversation.getStatus().equals(ConversationStatus.DISBAND)) {
                    throw new AppException(HttpStatus.GONE.value(), "Conversation is disbanded");
                } else if (conversation.getSettings().isRestrictedMessaging() &&
                        !(conversation.getSettings().isAllowDeputySendMessages() &&
                                conversation.getDeputies() != null &&
                                conversation.getDeputies().contains(userId))) {
                    throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "Messaging is restricted in this conversation");
                }
            }
        }
        // Conditionally set fields
        Date timestamp = new Date();
        Optional.ofNullable(userId).ifPresent(messageBuilder::senderId);
        Optional.of(messageDTO.conversationId()).ifPresent(messageBuilder::conversationId);
        Optional.ofNullable(messageDTO.content()).ifPresent(messageBuilder::content);
        Optional.ofNullable(messageDTO.media()).ifPresent(messageBuilder::media);
        Optional.of(timestamp).ifPresent(messageBuilder::createdAt);
        Optional.of(timestamp).ifPresent(messageBuilder::updatedAt);
        Optional.ofNullable(messageDTO.taggedUserIds()).ifPresent(messageBuilder::targetUserId);
        Optional.ofNullable(messageDTO.type()).ifPresent(messageBuilder::type);

        return messageRepository.save(messageBuilder.build());
    }

    @Override
    public List<MessageDTO> getMessagesByConversationId(String conversationId, int page, int size) {
        List<Message> messages = messageRepository.findByConversationId(conversationId, page, size);
        return messages.stream().map(MessageDTO::new).toList();
    }

    @Override
    public MessageDTO revokeMessage(String messageId) {
        Message message = messageRepository.findById(new ObjectId(messageId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
        message.setType(MessageType.REVOKED);
        message.setContent("This message has been revoked");
        message.setReactions(null);
        message.setMedia(null);
        message.setUpdatedAt(new Date());
        return new MessageDTO(messageRepository.save(message));
    }

    @Override
    public List<MessageDTO> shareMessage(Long senderId, String messageId, List<String> conversationIds) {
        Message existMessage = messageRepository.findById(new ObjectId(messageId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
        List<Message> messages = new ArrayList<>();
        for (String conversationId : conversationIds) {
            Conversation conversation = conversationRepository.findById(new ObjectId(conversationId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found"));
            if (!conversation.getMembers().contains(existMessage.getSenderId())) {
                throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not a member of this conversation");
            } else if (conversation.getType().equals(ConversationType.GROUP)) {
                if (conversation.getStatus().equals(ConversationStatus.DISBAND)) {
                    throw new AppException(HttpStatus.GONE.value(), "Conversation is disbanded");
                } else if (conversation.getSettings().isRestrictedMessaging() &&
                        !(conversation.getSettings().isAllowDeputySendMessages() &&
                                conversation.getDeputies() != null &&
                                conversation.getDeputies().contains(senderId))) {
                    throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "Messaging is restricted in this conversation");
                }
            }
            Message.MessageBuilder messageBuilder = Message.builder();
            messageBuilder.senderId(senderId);
            messageBuilder.conversationId(conversationId);
            if (existMessage.getMedia() != null) {
                messageBuilder.media(existMessage.getMedia());
            } else {
                messageBuilder.content(existMessage.getContent());
            }
            messageBuilder.type(existMessage.getType());
            messageBuilder.createdAt(new Date());
            messageBuilder.updatedAt(new Date());
            messages.add(messageBuilder.build());
        }
        List<Message> savedMessages = messageRepository.saveAll(messages);
        return savedMessages.stream().map(MessageDTO::new).toList();
    }

    @Override
    public MessageDTO reactMessage(Long senderId, String messageId, ReactionType reaction) {
        Message message = messageRepository.findById(new ObjectId(messageId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
        if (message.getReactions() == null) {
            message.setReactions(new HashMap<>());
        }
        message.getReactions().computeIfAbsent(reaction, k -> new ArrayList<>());
        message.getReactions().get(reaction).add(senderId);
        return new MessageDTO(messageRepository.save(message));
    }
}
