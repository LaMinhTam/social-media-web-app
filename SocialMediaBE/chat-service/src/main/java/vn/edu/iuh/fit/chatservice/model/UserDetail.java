package vn.edu.iuh.fit.chatservice.model;

public record UserDetail(
        Long user_id,
        String name,
        String email,
        String image_url
) {
}
