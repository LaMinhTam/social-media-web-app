package vn.edu.iuh.fit.chatservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.model.UserDetail;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDTO {
    private String conversationId;
    private String name;
    private String image;
    private List<UserDetail> members;
    private ConversationType type;
    private Long ownerId;
    private ConversationSettings settings;
    private List<String> pinnedMessages;

    public ConversationDTO(Conversation conversation, Map<Long, UserDetail> userModels, Long id) {
        ConversationDTO conversationDTO = ConversationDTO.builder()
                .conversationId(conversation.getId().toHexString())
                .members(conversation.getMembers().stream().map(userModels::get).toList())
                .type(conversation.getType())
                .build();
        if (conversation.getType().equals(ConversationType.PRIVATE)) {
            UserDetail userDetail = conversationDTO.getOtherMember(id);
            if (userDetail != null) {
                conversationDTO.setName(userDetail.name());
                conversationDTO.setImage(userDetail.image_url());
            }
        } else {
            conversationDTO.setOwnerId(conversation.getOwnerId());
            conversationDTO.setName(conversation.getName());
            conversationDTO.setImage(conversation.getAvatar());
        }
        this.conversationId = conversationDTO.getConversationId();
        this.name = conversationDTO.getName();
        this.image = conversationDTO.getImage();
        this.members = conversationDTO.getMembers();
        this.type = conversationDTO.getType();
        this.ownerId = conversationDTO.getOwnerId();
        this.settings = conversation.getSettings();
        this.pinnedMessages = conversation.getPinnedMessages();
    }

    public UserDetail getOtherMember(Long id) {
        return members.stream()
                .filter(member -> !member.user_id().equals(id))
                .findFirst()
                .orElse(null);
    }
}
