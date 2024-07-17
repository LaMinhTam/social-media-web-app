package vn.edu.iuh.fit.chatservice.dto;

import java.util.List;

public record ShareMessageRequest(
        String messageId,
        List<String> conversationIds
) {
}
