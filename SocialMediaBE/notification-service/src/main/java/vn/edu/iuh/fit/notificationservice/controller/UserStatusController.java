package vn.edu.iuh.fit.notificationservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.iuh.fit.notificationservice.service.UserSessionService;

import java.util.List;

@RestController
@RequestMapping("/user-status")
public class UserStatusController {
    private final UserSessionService userSessionService;

    public UserStatusController(UserSessionService userSessionService) {
        this.userSessionService = userSessionService;
    }

    @GetMapping("/online")
    public ResponseEntity<?> isUserOnline(@RequestParam(name = "user_ids") List<String> userIds) {
        return ResponseEntity.ok(userSessionService.getUserStatuses(userIds));
    }
}
