package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;

import java.util.List;

public record CreateConversationRequest(
        String name,
        String image,
        List<Long> members,
        ConversationType type
) {
}
