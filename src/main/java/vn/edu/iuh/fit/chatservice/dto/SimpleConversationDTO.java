package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;

import java.util.List;

public record SimpleConversationDTO(
        String conversationId,
        String name,
        String image,
        List<Long> members,
        ConversationType type,
        List<Long> deputies

) {
    public SimpleConversationDTO(Conversation conversation) {
        this(conversation.getId().toHexString(),
                conversation.getName(),
                conversation.getAvatar(),
                conversation.getMembers(),
                conversation.getType(),
                conversation.getDeputies());
    }
}
