package vn.edu.iuh.fit.notificationservice.dto;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record UserDetail(
        Long user_id,
        String name,
        String email,
        String image_url
) {
    public static List<UserDetail> getUserDetailsFromMap(Message message, Map<Long, UserDetail> userDetailMap) {
        return message.targetUserId() == null ? null : message.targetUserId().stream()
                .map(userDetailMap::get)
                .toList();
    }

    public static List<UserDetail> getUserDetailsFromList(Message message, List<UserDetail> userDetails) {
        return message.targetUserId() == null ? null : userDetails.stream()
                .filter(userDetail -> message.targetUserId().contains(userDetail.user_id()))
                .toList();
    }

    public static Map<Long, UserDetail> getReadByUserDetailMap(Map<Long, String> readBy, Map<Long, UserDetail> userDetailMap) {
        return readBy.entrySet().stream()
                .filter(entry -> userDetailMap.containsKey(entry.getKey()))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> userDetailMap.get(entry.getKey())
                ));
    }
}
