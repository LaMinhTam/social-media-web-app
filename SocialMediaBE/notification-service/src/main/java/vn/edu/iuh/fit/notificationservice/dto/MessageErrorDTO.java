package vn.edu.iuh.fit.notificationservice.dto;

import java.util.Date;

public record MessageErrorDTO(
        String conversationId,
        String message,
        String reason,
        Date timestamp
) {
}
