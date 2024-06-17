package vn.edu.iuh.fit.chatservice.dto;

import java.util.List;

public record ReplyMessageDTO(
        String messageId,
        String content,
        List<String> media,
        Long senderId
) {
}
