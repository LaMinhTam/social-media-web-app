package vn.edu.iuh.fit.notificationservice.dto;

import java.util.Date;
import java.util.EnumMap;
import java.util.List;

public record MessageFromWebClient(
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
        Date updated_at,
        List<Long> deleted_by
) {
}
