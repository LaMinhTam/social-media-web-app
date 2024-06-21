package vn.edu.iuh.fit.notificationservice.dto;

public record MessageNotificationPayload(
        Conversation conversation,
        Message message,
        String destination
) {
}
