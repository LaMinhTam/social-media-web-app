package vn.edu.iuh.fit.notificationservice.dto;

import java.util.List;

public record ConversationDTO(
        String conversationId,
        String name,
        String image,
        List<UserDetail> members,
        ConversationType type,
        Long ownerId,
        ConversationSettings settings,
        List<String> pinnedMessages) {
}
