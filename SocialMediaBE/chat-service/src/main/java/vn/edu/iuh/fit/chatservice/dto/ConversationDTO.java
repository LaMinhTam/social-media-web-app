package vn.edu.iuh.fit.chatservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.model.UserDetail;

import java.util.List;

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
//        ConversationStatus status
}
