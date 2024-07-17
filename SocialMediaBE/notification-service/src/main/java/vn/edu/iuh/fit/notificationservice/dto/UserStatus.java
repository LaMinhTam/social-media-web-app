package vn.edu.iuh.fit.notificationservice.dto;

import java.io.Serial;
import java.io.Serializable;

public record UserStatus(String userId, OnlineStatus online, long timestamp) implements Serializable {
    @Serial
    private static final long serialVersionUID = 7363870089790412918L;
}
