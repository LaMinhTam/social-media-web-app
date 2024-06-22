package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.entity.message.NotificationType;
import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;
import vn.edu.iuh.fit.chatservice.model.UserDetail;

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
                               List<UserDetail> readBy,
                               ReplyMessageDTO replyMessage) {

    public MessageDetailDTO(Message message, UserDetail senderUserDetail, List<UserDetail> targetUserDetails, List<UserDetail> readBy, ReplyMessageDTO replyMessage) {
        this(message.getId().toString(),
                message.getConversationId(),
                senderUserDetail,
                targetUserDetails,
                message.getContent(),
                message.getMedia(),
                message.getType(),
                message.getNotificationType(),
                message.getReactions(),
                message.getCreatedAt(),
                message.getUpdatedAt(),
                readBy,
                replyMessage);
    }

    public static MessageDetailDTO createMessageDetailDTO(Message message, Map<Long, UserDetail> userDetailMap) {
        UserDetail senderUserDetail = userDetailMap.get(message.getSenderId());
        List<UserDetail> targetUserDetails = (message.getTargetUserId() != null)
                ? message.getTargetUserId().stream().map(userDetailMap::get).toList()
                : null;
        return new MessageDetailDTO(message.getId().toString(), message.getConversationId(), senderUserDetail, targetUserDetails, message.getContent(), message.getMedia(), message.getType(), message.getNotificationType(), message.getReactions(), message.getCreatedAt(), message.getUpdatedAt(), null, null);
    }
}
