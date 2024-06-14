package vn.edu.iuh.fit.notificationservice.dto;

import java.util.List;

public record MessageFromClientDTO(
        Long user_id,
        String conversation_id,
        String content,
        List<String> media,
        MessageType type,
        String reply_to_message_id,
        List<Long> tagged_user_ids
) {
}
