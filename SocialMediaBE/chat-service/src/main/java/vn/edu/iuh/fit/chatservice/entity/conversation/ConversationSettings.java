package vn.edu.iuh.fit.chatservice.entity.conversation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
class ConversationSettings {
    private boolean isConfirmNewMember;
    private boolean isRestrictedMessaging;
    private boolean isAllowDeputySendMessages;
    private String linkToJoinGroup;
    private boolean isAllowMemberToChangeGroupInfo;
    private boolean isAllowDeputyAddMember;
    private boolean isAllowDeputyRemoveMember;
    private boolean isAllowDeputyChangeGroupInfo;
    private boolean isAllowMemberToPinMessage;
}