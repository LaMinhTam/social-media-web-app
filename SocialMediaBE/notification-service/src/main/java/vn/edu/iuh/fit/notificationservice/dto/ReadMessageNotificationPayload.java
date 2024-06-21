package vn.edu.iuh.fit.notificationservice.dto;

public record ReadMessageNotificationPayload(
        Long id,
        Conversation conversation,
        Message message
) {
}
