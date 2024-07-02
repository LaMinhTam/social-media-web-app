package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.entity.message.ReactionType;

public record ReactRequest(String messageId, ReactionType reaction) {
}
