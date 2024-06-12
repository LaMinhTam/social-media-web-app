package vn.edu.iuh.fit.chatservice.entity.conversation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class ConversationSettings {
    private boolean isConfirmNewMember;
    private boolean isRestrictedMessaging;
    private boolean isAllowDeputySendMessages;
    private boolean isJoinByLink;
    private String linkToJoinGroup;
    private boolean isAllowMemberToChangeGroupInfo;
    private boolean isAllowDeputyChangeGroupInfo;
    private boolean isAllowDeputyToInviteMember;
    private boolean isAllowMemberToInviteMember;
    private boolean isAllowDeputyRemoveMember;
    private boolean isAllowMemberToPinMessage;
    private boolean isAllowDeputyPromoteMember;
    private boolean isAllowDeputyDemoteMember;

    public ConversationSettings() {
        this.isConfirmNewMember = false;
        this.isRestrictedMessaging = false;
        this.isAllowDeputySendMessages = false;
        this.linkToJoinGroup = "";
        this.isAllowMemberToChangeGroupInfo = false;
        this.isAllowDeputyToInviteMember = false;
        this.isAllowMemberToInviteMember = false;
        this.isAllowDeputyRemoveMember = false;
        this.isAllowDeputyChangeGroupInfo = false;
        this.isAllowMemberToPinMessage = false;
        this.isAllowDeputyPromoteMember = false;
        this.isAllowDeputyDemoteMember = false;
    }
}