package vn.edu.iuh.fit.chatservice.dto;

import vn.edu.iuh.fit.chatservice.model.UserDetail;

public record ReactionDetail(UserDetail user, Long count) {
}
