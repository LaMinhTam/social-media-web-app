package vn.edu.iuh.fit.notificationservice.dto;

public record FriendRequestDTO(
        Long id,
        Long target,
        Long source,
        String type
) {
}