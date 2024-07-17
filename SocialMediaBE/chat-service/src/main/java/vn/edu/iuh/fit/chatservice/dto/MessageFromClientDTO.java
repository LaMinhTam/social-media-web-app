package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.message.MessageType;

import java.util.Date;
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
