package vn.edu.iuh.fit.notificationservice.dto;

import java.util.List;

public record ReplyMessageDTO(
        String message_id,
        String content,
        List<String> media,
        Long sender_id,
        MessageType type
) {
}
