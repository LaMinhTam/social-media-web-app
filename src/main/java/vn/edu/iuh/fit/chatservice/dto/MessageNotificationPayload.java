package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.model.ConversationModel;
import vn.edu.iuh.fit.chatservice.model.MessageModel;

public record MessageNotificationPayload(
        ConversationModel conversation,
        MessageModel message,
        String destination
) {
}
