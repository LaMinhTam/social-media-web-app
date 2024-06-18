package vn.edu.iuh.fit.postservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.postservice.dto.PostDetail;
import vn.edu.iuh.fit.postservice.service.PostService;
import vn.edu.iuh.fit.postservice.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/user-wall")
public class UserController {
    private final UserService userService;
    private final PostService postService;

    public UserController(UserService userService, PostService postService) {
        this.userService = userService;
        this.postService = postService;
    }

    @PostMapping
    public void saveUser(Long userId) {
        userService.saveUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, PostDetail>> getUserWall(
            @PathVariable Long id,
            @RequestParam("page") int page,
            @RequestParam("size") int size) {
        return ResponseEntity.ok().body(postService.findUserWall(id, --page, size));
    }

    @PostMapping("/follow/{followingId}")
    public void followUser(@RequestHeader("sub") Long userId, @PathVariable Long followingId) {
        userService.followUser(userId, followingId);
    }
}
