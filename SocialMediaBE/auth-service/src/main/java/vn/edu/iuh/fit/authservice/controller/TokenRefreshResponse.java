package vn.edu.iuh.fit.authservice.controller;

public record TokenRefreshResponse (String accessToken, String refreshToken) {
}
