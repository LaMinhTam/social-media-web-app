package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.model.ConversationModel;
import vn.edu.iuh.fit.chatservice.model.MessageModel;

public record MessageNotificationRequest(ConversationModel conversation, MessageModel message) {
}
