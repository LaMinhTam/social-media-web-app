package vn.edu.iuh.fit.authservice.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import vn.edu.iuh.fit.authservice.client.UserClient;
import vn.edu.iuh.fit.authservice.exception.BadRequestException;
import vn.edu.iuh.fit.authservice.model.AuthProvider;
import vn.edu.iuh.fit.authservice.model.User;
import vn.edu.iuh.fit.authservice.dto.*;
import vn.edu.iuh.fit.authservice.repository.UserRepository;
import vn.edu.iuh.fit.authservice.security.CustomUserDetailsService;
import vn.edu.iuh.fit.authservice.security.TokenProvider;
import vn.edu.iuh.fit.authservice.security.UserPrincipal;

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

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.createToken(authentication);
        String refreshToken = tokenProvider.refreshToken((UserPrincipal) authentication.getPrincipal());
        return ResponseEntity.ok(new TokenRefreshResponse(accessToken, refreshToken));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email address already in use.");
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
        userClient.createUser(new RequestCreateUser(result.getId(), signUpRequest.getName(), signUpRequest.getEmail(), "https://source.unsplash.com/random"));

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "User registered successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("email") String email, @Valid @RequestBody TokenRefreshRequest tokenRefreshRequest) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String accessToken = tokenProvider.accessToken((UserPrincipal) userDetails);
        String refreshToken = tokenProvider.refreshToken((UserPrincipal) userDetails);
        return ResponseEntity.ok(new TokenRefreshResponse(accessToken, refreshToken));
    }
}
