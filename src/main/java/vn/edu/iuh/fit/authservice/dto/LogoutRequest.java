package vn.edu.iuh.fit.authservice.dto;

public record LogoutRequest(String accessToken, String refreshToken) {
}

