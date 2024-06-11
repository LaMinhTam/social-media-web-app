package vn.edu.iuh.fit.userservice.controller;

import jakarta.ws.rs.QueryParam;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.userservice.dto.RequestCreateUser;
import vn.edu.iuh.fit.userservice.entity.User;
import vn.edu.iuh.fit.userservice.model.UserModel;
import vn.edu.iuh.fit.userservice.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create-user")
    public User createUser(@RequestBody RequestCreateUser request) {
        return userService.createUser(request.id(), request.name(), request.email(), request.imageUrl());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("sub") Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUser(@QueryParam("keyword") String keyword) {
        return ResponseEntity.ok(userService.searchUser(keyword));
    }

    @GetMapping
    public List<UserModel> getUsersByIds(@RequestParam List<Long> ids) {
        return userService.getUsersByIds(ids);
    }
}
