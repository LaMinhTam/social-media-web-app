package vn.edu.iuh.fit.userservice.dto;

public record FriendRequestDTO(
        Long id,
        Long target,
        Long source,
        String type
) {
}
