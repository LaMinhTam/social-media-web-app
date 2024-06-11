package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;

import java.util.List;

public record PrivateConversationDTO(
        Long id,
        String name,
        String image,
        List<Long> members
) {

}
