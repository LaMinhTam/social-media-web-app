package vn.edu.iuh.fit.chatservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.MongoId;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationStatus;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public record ConversationModel(
        String id,
        Long ownerId,
        List<Long> deputies,
        ConversationType type,
        String name,
        String avatar,
        List<Long> members,
        String lastMessageId,
        Date lastActivity,
        ConversationSettings settings,
        ConversationStatus status,
        Map<String, String> views,
        Map<String, Boolean> mutedStatus,
        Map<String, Boolean> notificationSettings,
        List<String> pinnedMessages,
        Date createdAt,
        Date updatedAt,
        Map<Long, String> readBy
) {
    public ConversationModel(Conversation conversation) {
        this(
                conversation.getId().toHexString(),
                conversation.getOwnerId(),
                conversation.getDeputies(),
                conversation.getType(),
                conversation.getName(),
                conversation.getAvatar(),
                conversation.getMembers(),
                conversation.getLastMessageId(),
                conversation.getLastActivity(),
                conversation.getSettings(),
                conversation.getStatus(),
                conversation.getViews(),
                conversation.getMutedStatus(),
                conversation.getNotificationSettings(),
                conversation.getPinnedMessages(),
                conversation.getCreatedAt(),
                conversation.getUpdatedAt(),
                conversation.getReadBy()
        );
    }
}
