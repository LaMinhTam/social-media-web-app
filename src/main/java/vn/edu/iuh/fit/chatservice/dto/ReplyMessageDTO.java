package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.message.MessageType;

import java.util.List;

public record ReplyMessageDTO(
        String messageId,
        String content,
        List<String> media,
        Long senderId,
        MessageType type
) {
}
