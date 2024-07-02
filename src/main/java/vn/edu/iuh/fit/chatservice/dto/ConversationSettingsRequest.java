package vn.edu.iuh.fit.chatservice.dto;

public record ConversationSettingsRequest(
        boolean isConfirmNewMember,
        boolean isRestrictedMessaging,
        boolean isAllowDeputySendMessages,
        boolean isJoinByLink,
        boolean isAllowMemberToChangeGroupInfo,
        boolean isAllowDeputyToInviteMember,
        boolean isAllowMemberToInviteMember,
        boolean isAllowDeputyRemoveMember,
        boolean isAllowDeputyChangeGroupInfo,
        boolean isAllowMemberToPinMessage,
        boolean isAllowDeputyPromoteMember,
        boolean isAllowDeputyDemoteMember
) {
}
