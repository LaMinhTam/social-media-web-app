package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.entity.message.NotificationType;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;

import java.util.Date;
import java.util.EnumMap;
import java.util.List;

public record MessageToWebClient(
        String id,
        String conversation_id,
        Long sender_id,
        List<Long> target_user_id,
        String content,
        List<String> media,
        String status,
        MessageType type,
        NotificationType notification_type,
        EnumMap<ReactionType, List<Long>> reactions,
        Date created_at,
        Date updated_at
) {
    public MessageToWebClient(Message message) {
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
