package vn.edu.iuh.fit.authservice.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import vn.edu.iuh.fit.authservice.client.UserClient;
import vn.edu.iuh.fit.authservice.client.UserWallClient;
import vn.edu.iuh.fit.authservice.dto.*;
import vn.edu.iuh.fit.authservice.model.AuthProvider;
import vn.edu.iuh.fit.authservice.model.User;
import vn.edu.iuh.fit.authservice.repository.UserRepository;
import vn.edu.iuh.fit.authservice.security.CustomUserDetailsService;
import vn.edu.iuh.fit.authservice.security.TokenProvider;
import vn.edu.iuh.fit.authservice.security.UserPrincipal;
import vn.edu.iuh.fit.authservice.service.AuthService;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private UserClient userClient;
    @Autowired
    private UserWallClient userWallClient;
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            String accessToken = tokenProvider.accessToken(principal);
            String refreshToken = tokenProvider.refreshToken(principal);
            return ResponseEntity.ok(new TokenRefreshResponse(accessToken, refreshToken));
        } catch (InternalAuthenticationServiceException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email or password is incorrect");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email address already in use.");
        }

        // Creating user's account
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(signUpRequest.getPassword());
        user.setProvider(AuthProvider.local);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/user/me")
                .buildAndExpand(result.getId()).toUri();
        userClient.createUser(new RequestCreateUser(result.getId(), signUpRequest.getName(), signUpRequest.getEmail(), "https://source.unsplash.com/random", "https://source.unsplash.com/random"));
        userWallClient.createUser(result.getId());
        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "User registered successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("email") String email, @RequestHeader("sub") Long sub, @RequestHeader("refresh-token") String refreshToken) {
        authService.setTokenToBlackList(refreshToken, sub);

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String newAccessToken = tokenProvider.accessToken((UserPrincipal) userDetails);
        String newRefreshToken = tokenProvider.refreshToken((UserPrincipal) userDetails);
        return ResponseEntity.ok(new TokenRefreshResponse(newAccessToken, newRefreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("sub") Long sub, @RequestHeader("refresh-token") String refreshToken) {
        authService.setTokenToBlackList(refreshToken, sub);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestHeader("sub") Long sub, @RequestBody ResetPasswordRequest request) {
        if (request.oldPassword() == null || request.oldPassword().isEmpty() ||
                request.newPassword() == null || request.newPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords cannot be null or empty.");
        }

        User user = userRepository.findById(sub)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + sub));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Old password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "Password reset successfully."));
    }

}
