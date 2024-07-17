package vn.edu.iuh.fit.notificationservice.dto;

import java.util.Date;
import java.util.EnumMap;
import java.util.List;

public record Message(
        String id,
        String conversationId,
        Long senderId,
        List<Long> targetUserId,
        String replyToMessageId,
        String content,
        List<String> media,
        String status,
        MessageType type,
        NotificationType notificationType,
        EnumMap<ReactionType, List<Long>> reactions,
        Date createdAt,
        Date updatedAt,
        List<Long> deletedBy
) {
    public Message(MessageFromWebClient message) {
        this(
                message.id(),
                message.conversation_id(),
                message.sender_id(),
                message.target_user_id(),
                message.reply_to_message_id(),
                message.content(),
                message.media(),
                message.status(),
                message.type(),
                message.notification_type(),
                message.reactions(),
                message.created_at(),
                message.updated_at(),
                message.deleted_by()
        );
    }
}