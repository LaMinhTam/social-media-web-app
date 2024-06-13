package vn.edu.iuh.fit.notificationservice.dto;

import java.util.List;

public record MessageFromClientDTO(
        Long userId,
        String conversationId,
        String content,
        List<String> media,
        MessageType type,
        String replyToMessageId,
        List<Long> taggedUserIds
) {
}
