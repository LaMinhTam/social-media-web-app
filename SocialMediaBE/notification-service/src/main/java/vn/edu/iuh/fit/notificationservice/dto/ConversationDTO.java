package vn.edu.iuh.fit.notificationservice.dto;

import java.util.List;
import java.util.Map;

public record ConversationDTO(
        String conversationId,
        String name,
        String image,
        Map<Long, UserDetail> members,
        ConversationType type,
        Long ownerId,
        ConversationSettings settings,
        List<String> pinnedMessages) {
}
