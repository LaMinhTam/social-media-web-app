package vn.edu.iuh.fit.chatservice.model;

import vn.edu.iuh.fit.chatservice.dto.OnlineStatus;

import java.io.Serial;
import java.io.Serializable;

public record UserStatus(String userId, OnlineStatus online, long timestamp) implements Serializable {
    @Serial
    private static final long serialVersionUID = 7363870089790412918L;
}
