package vn.edu.iuh.fit.postservice.dto;

public record UserDetail(
        Long user_id,
        String name,
        String email,
        String image_url
) {
}
