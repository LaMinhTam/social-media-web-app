package vn.edu.iuh.fit.chatservice.service.impl;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.chatservice.dto.MessageFromClientDTO;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.repository.ConversationRepository;
import vn.edu.iuh.fit.chatservice.repository.MessageRepository;
import vn.edu.iuh.fit.chatservice.service.MessageService;

import java.util.Date;
import java.util.Optional;

@Service
public class MessageServiceImpl implements MessageService {
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    public MessageServiceImpl(MessageRepository messageRepository, ConversationRepository conversationRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    @Override
    public Message saveMessage(Long userId, MessageFromClientDTO messageDTO) throws Exception {
        Message.MessageBuilder messageBuilder = Message.builder();
        if (!messageDTO.type().equals(MessageType.TEST)) {
            conversationRepository.findById(new ObjectId(messageDTO.conversationId()))
                    .orElseThrow(() -> new Exception("Conversation not found"));
        }
        // Conditionally set fields
        Date timestamp = new Date();
        Optional.ofNullable(userId).ifPresent(messageBuilder::senderId);
        Optional.of(messageDTO.conversationId()).ifPresent(messageBuilder::conversationId);
        Optional.ofNullable(messageDTO.content()).ifPresent(messageBuilder::content);
        Optional.ofNullable(messageDTO.media()).ifPresent(messageBuilder::media);
        Optional.of(timestamp).ifPresent(messageBuilder::createdAt);
        Optional.of(timestamp).ifPresent(messageBuilder::updatedAt);
        Optional.ofNullable(messageDTO.taggedUserIds()).ifPresent(messageBuilder::taggedUserId);
        Optional.ofNullable(messageDTO.type()).ifPresent(messageBuilder::type);

        return messageRepository.save(messageBuilder.build());
    }
}
