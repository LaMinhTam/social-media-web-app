package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.model.ConversationModel;
import vn.edu.iuh.fit.chatservice.model.MessageModel;

public record ReadMessageNotificationPayload(
        Long id,
        ConversationModel conversation,
        MessageModel message
) {
}
