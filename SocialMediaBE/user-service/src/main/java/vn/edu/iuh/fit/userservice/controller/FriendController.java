package vn.edu.iuh.fit.userservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.userservice.dto.FriendRequest;
import vn.edu.iuh.fit.userservice.dto.FriendRequestCreate;
import vn.edu.iuh.fit.userservice.dto.UserDTO;
import vn.edu.iuh.fit.userservice.entity.FriendRelationship;
import vn.edu.iuh.fit.userservice.model.UserModel;
import vn.edu.iuh.fit.userservice.service.FriendService;

import java.util.List;

@RestController
@RequestMapping("/friends")
public class FriendController {
    private final FriendService friendService;

    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }

    @GetMapping
    public ResponseEntity<UserDTO> getFriends(@RequestHeader("sub") Long userId, @RequestParam("type") int type) throws Exception {
        return ResponseEntity.ok(friendService.getFriendByType(userId, type));
    }

    @GetMapping("/friend")
    public List<UserModel> getFriends(@RequestHeader("sub") Long userId) throws Exception {
        return friendService.getFriend(userId);
    }

    @PostMapping("/send")
    public ResponseEntity<FriendRelationship> sendFriendRequest(@RequestHeader("sub") Long senderId, @RequestBody FriendRequestCreate friendRequest) {
        return ResponseEntity.ok(friendService.sendFriendRequest(senderId, friendRequest.targetId()));
    }

    @DeleteMapping("/revoke")
    public ResponseEntity<FriendRelationship> revokeFriendRequest(@RequestHeader("sub") Long senderId, @RequestBody FriendRequest friendRequest) {
        return ResponseEntity.ok(friendService.revokeFriendRequest(senderId, friendRequest.targetId(), friendRequest.friendRequestId()));
    }

    @PostMapping("/accept")
    public ResponseEntity<FriendRelationship> acceptFriendRequest(@RequestHeader("sub") Long receiverId, @RequestBody FriendRequest friendRequest) {
        return ResponseEntity.ok(friendService.acceptFriendRequest(receiverId, friendRequest.targetId(), friendRequest.friendRequestId()));
    }

    @PostMapping("/block")
    public ResponseEntity<FriendRelationship> blockFriendRequest(@RequestHeader("sub") Long senderId, @RequestBody FriendRequestCreate friendRequest) {
        return ResponseEntity.ok(friendService.blockFriendRequest(senderId, friendRequest.targetId()));
    }

    @DeleteMapping("/unblock")
    public ResponseEntity<FriendRelationship> unblockFriendRequest(@RequestHeader("sub") Long senderId, @RequestBody FriendRequest friendRequest) {
        return ResponseEntity.ok(friendService.unblockFriendRequest(senderId, friendRequest.targetId(), friendRequest.friendRequestId()));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<FriendRelationship> removeFriend(@RequestHeader("sub") Long senderId, @RequestBody FriendRequest friendRequest) {
        return ResponseEntity.ok(friendService.removeFriend(senderId, friendRequest.targetId(), friendRequest.friendRequestId()));
    }
}
