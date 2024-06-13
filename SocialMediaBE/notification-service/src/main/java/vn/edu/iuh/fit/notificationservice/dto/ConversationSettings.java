package vn.edu.iuh.fit.notificationservice.dto;

public record ConversationSettings(
        boolean isConfirmNewMember,
        boolean isRestrictedMessaging,
        boolean isAllowDeputySendMessages,
        boolean isJoinByLink,
        String linkToJoinGroup,
        boolean isAllowMemberToChangeGroupInfo,
        boolean isAllowDeputyChangeGroupInfo,
        boolean isAllowDeputyToInviteMember,
        boolean isAllowMemberToInviteMember,
        boolean isAllowDeputyRemoveMember,
        boolean isAllowMemberToPinMessage,
        boolean isAllowDeputyPromoteMember,
        boolean isAllowDeputyDemoteMember) {

}