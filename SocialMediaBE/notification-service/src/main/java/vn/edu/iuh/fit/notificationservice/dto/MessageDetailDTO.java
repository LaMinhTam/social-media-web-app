package vn.edu.iuh.fit.notificationservice.dto;

import java.util.Date;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

public record MessageDetailDTO(String messageId,
                               String conversationId,
                               UserDetail userDetail,
                               List<UserDetail> targetUserId,
                               String content,
                               List<String> media,
                               MessageType type,
                               NotificationType notificationType,
                               EnumMap<ReactionType, List<Long>> reactions,
                               Date createdAt,
                               Date updatedAt,
                               Map<Long, UserDetail> readBy,
                               ReplyMessageDTO replyMessage) {

    public MessageDetailDTO(Message message, UserDetail senderUserDetail, List<UserDetail> targetUserDetails, Map<Long, UserDetail> readBy, ReplyMessageDTO replyMessage) {
        this(message.id(),
                message.conversationId(),
                senderUserDetail,
                targetUserDetails,
                message.content(),
                message.media(),
                message.type(),
                message.notificationType(),
                message.reactions(),
                message.createdAt(),
                message.updatedAt(),
                readBy,
                replyMessage);
    }
}
