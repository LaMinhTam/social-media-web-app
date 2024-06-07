package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.entity.message.Reaction;

import java.util.Date;
import java.util.List;

public record MessageResponse(
        String messageId,
        String conversationId,
        String content,
        List<String> media,
        String status,
        MessageType type,
        List<Long> taggedUserId,
        List<Reaction> reactions,
        Date createdAt,
        Date updatedAt
) {
    public MessageResponse(Message message) {
        this(
                message.getId().toHexString(),
                message.getConversationId(),
                message.getContent(),
                message.getMedia(),
                message.getStatus(),
                message.getType(),
                message.getTaggedUserId(),
                message.getReactions(),
                message.getCreatedAt(),
                message.getUpdatedAt());
    }
}
