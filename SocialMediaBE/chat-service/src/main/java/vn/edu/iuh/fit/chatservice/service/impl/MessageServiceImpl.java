package vn.edu.iuh.fit.chatservice.service.impl;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.chatservice.client.NotificationClient;
import vn.edu.iuh.fit.chatservice.client.UserClient;
import vn.edu.iuh.fit.chatservice.dto.MessageDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageDetailDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageFromClientDTO;
import vn.edu.iuh.fit.chatservice.dto.ReplyMessageDTO;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationStatus;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;
import vn.edu.iuh.fit.chatservice.exception.AppException;
import vn.edu.iuh.fit.chatservice.model.UserDetail;
import vn.edu.iuh.fit.chatservice.repository.ConversationRepository;
import vn.edu.iuh.fit.chatservice.repository.MessageRepository;
import vn.edu.iuh.fit.chatservice.service.MessageService;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class MessageServiceImpl implements MessageService {
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserClient userClient;
    private final NotificationClient notificationClient;

    public MessageServiceImpl(MessageRepository messageRepository, ConversationRepository conversationRepository, UserClient userClient, NotificationClient notificationClient) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userClient = userClient;
        this.notificationClient = notificationClient;
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
        Optional.of(messageDTO.type()).ifPresent(messageBuilder::type);
        Optional.ofNullable(messageDTO.replyToMessageId()).ifPresent(messageBuilder::replyToMessageId);

        return messageRepository.save(messageBuilder.build());
    }

    @Override
    public List<MessageDetailDTO> getMessagesByConversationId(Long userId, Conversation conversation, String messageId, int size) {
        List<Message> messages = messageRepository.findMessagesAfterMessageId(userId, conversation.getId().toHexString(), messageId, size);

        Set<Long> userIds = messages.stream().flatMap(message -> Stream.concat(
                Stream.of(
                        message.getSenderId()),
                message.getTargetUserId() == null ? Stream.empty() : message.getTargetUserId().stream())
        ).collect(Collectors.toSet());
        userIds.addAll(conversation.getReadBy().keySet().stream().toList());

        Map<Long, UserDetail> userDetailMap = userClient.getUsersByIdsMap(new ArrayList<>(userIds));
        List<ObjectId> replyToMessageIds = messages.stream()
                .map(message -> {
                    if (message.getReplyToMessageId() != null) {
                        return new ObjectId(message.getReplyToMessageId());
                    }
                    return null;
                })
                .collect(Collectors.toSet())
                .stream().toList();
        Map<String, ReplyMessageDTO> replyMessage = messageRepository.findMessagesByIdIn(replyToMessageIds)
                .stream().collect(Collectors.toMap(message -> message.getId().toHexString(), message -> new ReplyMessageDTO(message.getId().toHexString(), message.getContent(), message.getMedia(), message.getSenderId())));
        return messages.stream()
                .map(message -> {
                    List<UserDetail> targetUserDetails = UserDetail.getUserDetailsFromMap(message, userDetailMap);
                    Map<Long, UserDetail> readBy = getReadByUserDetails(conversation, message, userDetailMap);
                    return new MessageDetailDTO(message, userDetailMap.get(message.getSenderId()), targetUserDetails, readBy, replyMessage.get(message.getReplyToMessageId()));
                })
                .toList();
    }

    private Map<Long, UserDetail> getReadByUserDetails(Conversation conversation, Message message, Map<Long, UserDetail> userDetailMap) {
        Map<Long, UserDetail> readBy = new HashMap<>();
        ObjectId messageId = message.getId();

        conversation.getReadBy().forEach((userId, lastReadMessageId) -> {
            if (isLaterMessage(lastReadMessageId, messageId)) {
                readBy.put(userId, userDetailMap.get(userId));
            }
        });

        return readBy;
    }

    @Override
    public MessageDTO revokeMessage(Long senderId, String messageId) {
        Message message = messageRepository.findById(new ObjectId(messageId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
        if (!message.getSenderId().equals(senderId)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You can't revoke this message");
        }
        Conversation conversation = conversationRepository.findById(new ObjectId(message.getConversationId())).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found"));
        message.setType(MessageType.REVOKED);
        message.setContent("This message has been revoked");
        message.setReactions(null);
        message.setMedia(null);
        message.setUpdatedAt(new Date());
        notificationClient.notifyConversationMembers(conversation, message, "revoke");
        Thread thread = new Thread(() -> {
            List<Message> messages = messageRepository.findMessagesByReplyToMessageId(message.getId().toHexString());
            messages.forEach(currentMessage ->
                    notificationClient.notifyRevokeReplyMessage(conversation, currentMessage)
            );
        });
        thread.start();
        return new MessageDTO(messageRepository.save(message));
    }

    @Override
    public List<MessageDTO> shareMessage(Long senderId, String messageId, List<String> conversationIds) {
        Message existMessage = messageRepository.findById(new ObjectId(messageId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
        List<Message> messages = new ArrayList<>();
        List<Conversation> conversations = new ArrayList<>();
        for (String conversationId : conversationIds) {
            Conversation conversation = conversationRepository.findById(new ObjectId(conversationId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found"));
            conversations.add(conversation);
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
        conversations.forEach(conversation -> {
            Message messageByConversationId = savedMessages.stream().filter(message -> message.getConversationId().equals(conversation.getId().toHexString())).findFirst().get();
            notificationClient.notifyConversationMembers(conversation, messageByConversationId, "message");
        });

        return savedMessages.stream().map(MessageDTO::new).toList();
    }

    @Override
    public MessageDTO reactMessage(Long senderId, String messageId, ReactionType reaction) {
        Message message = messageRepository.findById(new ObjectId(messageId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
        Conversation conversation = conversationRepository.findById(new ObjectId(message.getConversationId())).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found"));

        if (message.getReactions() == null) {
            message.setReactions(new EnumMap<>(ReactionType.class));
        }
        message.getReactions().computeIfAbsent(reaction, k -> new ArrayList<>());
        message.getReactions().get(reaction).add(senderId);
        notificationClient.notifyConversationMembers(conversation, message, "react");
        return new MessageDTO(messageRepository.save(message));
    }

    @Override
    public void markMessageAsRead(Long id, ObjectId messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
        Conversation conversation = conversationRepository.findById(new ObjectId(message.getConversationId()))
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found"));
        String lastReadMessageId = conversation.getReadBy().get(id);
        if (lastReadMessageId == null || isLaterMessage(lastReadMessageId, messageId)) {
            conversation.getReadBy().put(id, messageId.toHexString());
            conversationRepository.save(conversation);
        }
        notificationClient.notifyRead(id, conversation, message);
    }

    @Override
    public void deleteMessage(Long id, String messageId) {
        Message message = messageRepository.findById(new ObjectId(messageId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
        if (message.getDeletedBy() == null) {
            message.setDeletedBy(new ArrayList<>());
        }
        message.getDeletedBy().add(id);
        messageRepository.save(message);
    }

    @Override
    public ReplyMessageDTO getPlainMessage(Long id, String messageId) {
        Message message = messageRepository.findById(new ObjectId(messageId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
        Conversation conversation = conversationRepository.findById(new ObjectId(message.getConversationId())).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found"));
        if (!conversation.getMembers().contains(id)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not a member of this conversation");
        }
        return new ReplyMessageDTO(message.getId().toHexString(), message.getContent(), message.getMedia(), message.getSenderId());

    }

    private boolean isLaterMessage(String lastReadMessageId, ObjectId currentMessageId) {
        return currentMessageId.compareTo(new ObjectId(lastReadMessageId)) <= 0;
    }
}
