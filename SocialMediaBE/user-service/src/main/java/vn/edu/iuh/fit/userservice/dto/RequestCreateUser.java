package vn.edu.iuh.fit.userservice.dto;

public record RequestCreateUser(Long id, String name, String email, String imageUrl, String cover) {
}
