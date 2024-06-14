package vn.edu.iuh.fit.notificationservice.dto;

import java.util.*;

public record ConversationFromWebClient(
        String id,
        Long owner_id,
        List<Long> deputies,
        ConversationType type,
        String name,
        String avatar,
        List<Long> members,
        String last_message_id,
        Date last_activity,
        ConversationSettings settings,
        ConversationStatus status,
        Map<String, String> views,
        Map<String, Boolean> muted_status,
        Map<String, Boolean> notification_settings,
        List<String> pinned_messages,
        Date created_at,
        Date updated_at,
        Map<Long, String> read_by
) {
}
