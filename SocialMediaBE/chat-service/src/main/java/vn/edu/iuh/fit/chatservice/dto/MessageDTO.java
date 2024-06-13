package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;

import java.util.Date;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

public record MessageDTO(String messageId,
                         String conversationId,
                         Long senderId,
                         List<Long> taggedUserId,
                         String content,
                         List<String> media,
                         MessageType type,
                         EnumMap<ReactionType, List<Long>> reactions,
                         Date createdAt,
                         Date updatedAt) {
    public MessageDTO(Message message) {
        this(message.getId().toString(),
                message.getConversationId(),
                message.getSenderId(),
                message.getTargetUserId(),
                message.getContent(),
                message.getMedia(),
                message.getType(),
                message.getReactions(),
                message.getCreatedAt(),
                message.getUpdatedAt());
    }
}
