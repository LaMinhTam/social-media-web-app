package vn.edu.iuh.fit.apigateway.dto;

public record LogoutRequest(String accessToken, String refreshToken) {
}
