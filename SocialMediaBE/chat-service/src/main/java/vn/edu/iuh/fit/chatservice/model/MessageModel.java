package vn.edu.iuh.fit.chatservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.MongoId;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.entity.message.NotificationType;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;

import java.util.Date;
import java.util.EnumMap;
import java.util.List;

public record MessageModel(
        String id,
        String conversationId,
        Long senderId,
        List<Long> targetUserId,
        String content,
        List<String> media,
        String status,
        MessageType type,
        NotificationType notificationType,
        EnumMap<ReactionType, List<Long>> reactions,
        Date createdAt,
        Date updatedAt
        ) {
    public MessageModel(Message message) {
        this(
                message.getId().toHexString(),
                message.getConversationId(),
                message.getSenderId(),
                message.getTargetUserId(),
                message.getContent(),
                message.getMedia(),
                message.getStatus(),
                message.getType(),
                message.getNotificationType(),
                message.getReactions(),
                message.getCreatedAt(),
                message.getUpdatedAt()
        );
    }
}
