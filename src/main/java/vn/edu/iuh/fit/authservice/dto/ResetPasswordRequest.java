package vn.edu.iuh.fit.authservice.dto;

public record ResetPasswordRequest(
        String oldPassword,
        String newPassword
) {
}
