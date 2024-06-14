package vn.edu.iuh.fit.chatservice.model;

import vn.edu.iuh.fit.chatservice.entity.message.Message;

import java.util.List;
import java.util.Map;

public record UserDetail(
        Long user_id,
        String name,
        String email,
        String image_url
) {
    public static List<UserDetail> getUserDetailsFromMap(Message message, Map<Long, UserDetail> userDetailMap) {
        return message.getTargetUserId() == null ? null : message.getTargetUserId().stream()
                .map(userDetailMap::get)
                .toList();
    }

    public static List<UserDetail> getUserDetailsFromList(Message message, List<UserDetail> userDetails) {
        return message.getTargetUserId() == null ? null : userDetails.stream()
                .filter(userDetail -> message.getTargetUserId().contains(userDetail.user_id()))
                .toList();
    }
}
