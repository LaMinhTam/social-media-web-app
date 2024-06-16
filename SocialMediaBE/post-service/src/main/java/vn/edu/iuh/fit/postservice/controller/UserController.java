package vn.edu.iuh.fit.postservice.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.iuh.fit.postservice.service.UserService;

@RestController
@RequestMapping("/user-wall")
public class UserController {
     private final UserService userService;

     public UserController(UserService userService) {
         this.userService = userService;
     }

     @PostMapping
     public void saveUser(Long userId) {
         userService.saveUser(userId);
     }
}
