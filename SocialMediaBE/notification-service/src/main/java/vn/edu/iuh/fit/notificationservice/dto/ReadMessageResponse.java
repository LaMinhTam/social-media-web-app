package vn.edu.iuh.fit.notificationservice.dto;

public record ReadMessageResponse(
        String messageId,
        String conversationId,
        UserDetail userDetail
) {
}
