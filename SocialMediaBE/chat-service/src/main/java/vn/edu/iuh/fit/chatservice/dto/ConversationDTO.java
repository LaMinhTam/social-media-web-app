package vn.edu.iuh.fit.chatservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.model.UserDetail;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDTO implements Serializable {
    private static final long serialVersionUID = -6497321363058647683L;
    private String conversationId;
    private String name;
    private String image;
    private Map<Long, UserDetail> members;
    private ConversationType type;
    private Long ownerId;
    private ConversationSettings settings;
    private List<Long> deputies;
    private List<String> pinnedMessages;

    public ConversationDTO(Conversation conversation, Map<Long, UserDetail> userModels, Long id) {
        ConversationDTO conversationDTO = ConversationDTO.builder()
                .conversationId(conversation.getId().toHexString())
                .members(userModels)
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
        this.deputies = conversation.getDeputies();
        this.pinnedMessages = conversation.getPinnedMessages();
    }

    public UserDetail getOtherMember(Long id) {
        return members.get(members.keySet().stream().filter(memberId -> !memberId.equals(id)).findFirst().orElse(null));
    }
}
