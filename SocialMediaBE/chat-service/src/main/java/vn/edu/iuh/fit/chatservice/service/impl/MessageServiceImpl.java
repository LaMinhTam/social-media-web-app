package vn.edu.iuh.fit.chatservice.service.impl;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.chatservice.client.UserClient;
import vn.edu.iuh.fit.chatservice.dto.*;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationStatus;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;
import vn.edu.iuh.fit.chatservice.exception.AppException;
import vn.edu.iuh.fit.chatservice.message.MessageNotificationProducer;
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
    private final MessageNotificationProducer messageNotificationProducer;

    public MessageServiceImpl(MessageRepository messageRepository, ConversationRepository conversationRepository, UserClient userClient, MessageNotificationProducer messageNotificationProducer) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userClient = userClient;
        this.messageNotificationProducer = messageNotificationProducer;
    }

    @Override
    public Message saveMessage(Long userId, MessageFromClientDTO messageDTO) {
        validateMessageDTO(messageDTO, userId);
        // Conditionally set fields
        Message.MessageBuilder messageBuilder = Message.builder();
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

        Set<Long> userIds = messages.stream()
                .flatMap(message -> Stream.concat(Stream.of(message.getSenderId()),
                        Optional.ofNullable(message.getTargetUserId()).orElse(Collections.emptyList()).stream()))
                .collect(Collectors.toSet());

        userIds.addAll(conversation.getReadBy().keySet());

        Map<Long, UserDetail> userDetailMap = userClient.getUsersByIdsMap(userIds);
        List<ObjectId> replyToMessageIds = messages.stream()
                .map(message -> message.getReplyToMessageId() != null ? new ObjectId(message.getReplyToMessageId()) : null)
                .filter(Objects::nonNull)
                .toList();

        Map<String, ReplyMessageDTO> replyMessage = messageRepository.findMessagesByIdIn(replyToMessageIds)
                .stream()
                .collect(Collectors.toMap(
                        message -> message.getId().toHexString(),
                        message -> new ReplyMessageDTO(message.getId().toHexString(), message.getContent(), message.getMedia(), message.getSenderId())
                ));

        return messages.stream()
                .map(message -> {
                    List<UserDetail> targetUserDetails = UserDetail.getUserDetailsFromMap(message, userDetailMap);
                    List<UserDetail> readBy = getReadByUserDetails(conversation, message, userDetailMap);
                    return new MessageDetailDTO(message, userDetailMap.get(message.getSenderId()), targetUserDetails, readBy, replyMessage.get(message.getReplyToMessageId()));
                })
                .toList();
    }

    private List<UserDetail> getReadByUserDetails(Conversation conversation, Message message, Map<Long, UserDetail> userDetailMap) {
        return conversation.getReadBy().entrySet().stream()
                .filter(entry -> isLaterMessage(entry.getValue(), message.getId()))
                .map(entry -> userDetailMap.get(entry.getKey()))
                .toList();
    }

    @Override
    public MessageDTO revokeMessage(Long senderId, String messageId) {
        Message message = getMessageById(messageId);
        if (!message.getSenderId().equals(senderId)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You can't revoke this message");
        }
        Conversation conversation = getConversationById(message.getConversationId());
        updateRevokedMessage(message);
        messageNotificationProducer.notifyConversationMembers(conversation, message, "revoke");
        notifyRevokeReplyMessages(conversation, message);

        return new MessageDTO(messageRepository.save(message));
    }

    private void updateRevokedMessage(Message message) {
        message.setType(MessageType.REVOKED);
        message.setContent("This message has been revoked");
        message.setReactions(null);
        message.setMedia(null);
        message.setUpdatedAt(new Date());
    }

    private void notifyRevokeReplyMessages(Conversation conversation, Message message) {
        new Thread(() -> messageRepository.findMessagesByReplyToMessageId(message.getId().toHexString())
                .forEach(replyMessage -> messageNotificationProducer.notifyRevokeReplyMessage(conversation, replyMessage))).start();
    }

    @Override
    public List<MessageDTO> shareMessage(Long senderId, String messageId, List<String> conversationIds) {
        Message existMessage = getMessageById(messageId);
        List<Message> messages = new ArrayList<>();
        List<Conversation> conversations = new ArrayList<>();
        for (String conversationId : conversationIds) {
            Conversation conversation = conversationRepository.findById(new ObjectId(conversationId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found"));
            conversations.add(conversation);
            if (!conversation.getMembers().contains(existMessage.getSenderId())) {
                throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not a member of this conversation");
            } else if (conversation.getType().equals(ConversationType.GROUP) && conversation.getStatus().equals(ConversationStatus.DISBAND)) {
                throw new AppException(HttpStatus.GONE.value(), "Conversation is disbanded");
            } else if (conversation.getSettings().isRestrictedMessaging() &&
                    !(conversation.getSettings().isAllowDeputySendMessages() &&
                            Optional.ofNullable(conversation.getDeputies()).orElse(Collections.emptyList()).contains(senderId))) {
                throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "Messaging is restricted in this conversation");
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
        conversations.forEach(conversation -> savedMessages.stream()
                .filter(message -> message.getConversationId().equals(conversation.getId().toHexString()))
                .findFirst()
                .ifPresent(message -> messageNotificationProducer.notifyConversationMembers(conversation, message, "message")));

        return savedMessages.stream().map(MessageDTO::new).toList();
    }

    @Override
    public MessageDTO reactMessage(Long senderId, String messageId, ReactionType reaction) {
        Message message = getMessageById(messageId);
        Conversation conversation = getConversationById(message.getConversationId());

        if (message.getReactions() == null) {
            message.setReactions(new EnumMap<>(ReactionType.class));
        }
        message.getReactions().computeIfAbsent(reaction, k -> new ArrayList<>());
        message.getReactions().get(reaction).add(senderId);
        messageNotificationProducer.notifyConversationMembers(conversation, message, "react");
        return new MessageDTO(messageRepository.save(message));
    }

    @Override
    public void markMessageAsRead(Long id, String messageId) {
        Message message = getMessageById(messageId);
        Conversation conversation = getConversationById(message.getConversationId());
        //TODO: check if the message is later than the last read message
        conversation.getReadBy().compute(id, (userId, lastReadMessageId) ->
                Optional.ofNullable(lastReadMessageId)
                        .filter(lastReadId -> !isLaterMessage(lastReadId, new ObjectId(messageId)))
                        .orElse(messageId));
        conversationRepository.save(conversation);
        messageNotificationProducer.notifyRead(id, conversation, message);
    }

    @Override
    public void deleteMessage(Long id, String messageId) {
        Message message = getMessageById(messageId);
//        if (message.getDeletedBy() == null) {
//            message.setDeletedBy(new ArrayList<>());
//        }
//        message.getDeletedBy().add(id);
        //TODO: check if the message is later than the last read message
        Optional.ofNullable(message.getDeletedBy())
                .ifPresentOrElse(deletedBy -> deletedBy.add(id), () -> {
                    List<Long> deletedBy = new ArrayList<>();
                    deletedBy.add(id);
                    message.setDeletedBy(deletedBy);
                });

        messageRepository.save(message);
    }

    @Override
    public ReplyMessageDTO getPlainMessage(Long id, String messageId) {
        Message message = getMessageById(messageId);
        Conversation conversation = getConversationById(message.getConversationId());
        validateConversationMember(id, conversation);
        return new ReplyMessageDTO(message.getId().toHexString(), message.getContent(), message.getMedia(), message.getSenderId());

    }

    @Override
    public Map<String, List<ReactionDetail>> getReactions(Long id, String messageId) {
        Message message = getMessageById(messageId);
        Conversation conversation = getConversationById(message.getConversationId());
        validateConversationMember(id, conversation);

        Map<ReactionType, List<Long>> reactions = message.getReactions();
        Set<Long> userIds = reactions.values().stream().flatMap(Collection::stream).collect(Collectors.toSet());
        Map<Long, UserDetail> userDetailMap = userClient.getUsersByIdsMap(userIds);
//        Map<String, List<ReactionDetail>> reactionMap = new HashMap<>();
//
//        reactions.forEach((reactionType, userIdList) -> {
//            Map<Long, Long> userReactionCounts = userIdList.stream()
//                    .collect(Collectors.groupingBy(userId -> userId, Collectors.counting()));
//
//            List<ReactionDetail> reactionDetails = userReactionCounts.entrySet().stream()
//                    .map(entry -> {
//                        UserDetail userDetail = userDetailMap.get(entry.getKey());
//                        return new ReactionDetail(userDetail, entry.getValue());
//                    })
//                    .toList();
//
//            reactionMap.put(reactionType.name(), reactionDetails);
//        });
        // TODO: refactor this
        return reactions.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().name(),
                        entry -> entry.getValue().stream()
                                .collect(Collectors.groupingBy(userId -> userId, Collectors.counting()))
                                .entrySet().stream()
                                .map(userReaction -> new ReactionDetail(userDetailMap.get(userReaction.getKey()), userReaction.getValue()))
                                .toList()
                ));
    }


    private boolean isLaterMessage(String lastReadMessageId, ObjectId currentMessageId) {
        return currentMessageId.compareTo(new ObjectId(lastReadMessageId)) >= 0;
    }

    private Message getMessageById(String messageId) {
        return messageRepository.findById(new ObjectId(messageId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Message not found"));
    }

    private void validateMessageDTO(MessageFromClientDTO messageDTO, Long userId) {
        if (!messageDTO.type().equals(MessageType.TEST)) {
            Conversation conversation = conversationRepository.findById(new ObjectId(messageDTO.conversationId()), userId)
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found or you are not a member of this conversation"));

            if (conversation.getType().equals(ConversationType.GROUP) && conversation.getStatus().equals(ConversationStatus.DISBAND)) {
                throw new AppException(HttpStatus.GONE.value(), "Conversation is disbanded");
            }

            if (conversation.getType().equals(ConversationType.GROUP) && conversation.getSettings().isRestrictedMessaging() &&
                    !(conversation.getSettings().isAllowDeputySendMessages() &&
                            Optional.ofNullable(conversation.getDeputies()).orElse(Collections.emptyList()).contains(userId))) {
                throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "Messaging is restricted in this conversation");
            }
        }
    }

    private Conversation getConversationById(String conversationId) {
        return conversationRepository.findById(new ObjectId(conversationId)).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found"));
    }

    private void validateConversationMember(Long id, Conversation conversation) {
        if (!conversation.getMembers().contains(id)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not a member of this conversation");
        }
    }
}
