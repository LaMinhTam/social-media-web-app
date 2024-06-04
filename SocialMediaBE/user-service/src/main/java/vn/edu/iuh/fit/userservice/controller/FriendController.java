package vn.edu.iuh.fit.userservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.userservice.dto.FriendRequest;
import vn.edu.iuh.fit.userservice.dto.FriendRequestCreate;
import vn.edu.iuh.fit.userservice.service.FriendService;

@RestController
@RequestMapping("/friends")
public class FriendController {
    private final FriendService friendService;

    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }

    @GetMapping
    public ResponseEntity<?> getFriends(@RequestHeader("sub") Long userId, @RequestParam("type") int type) throws Exception {
        try{
            return ResponseEntity.ok(friendService.getFriendByType(userId, type));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendFriendRequest(@RequestHeader("sub") Long senderId, @RequestBody FriendRequestCreate friendRequest) {
        try {
            friendService.sendFriendRequest(senderId, friendRequest.targetId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("Friend request send successfully!");
    }

    @DeleteMapping("/revoke")
    public ResponseEntity<String> revokeFriendRequest(@RequestHeader("sub") Long senderId, @RequestBody FriendRequest friendRequest) {
        try {
            friendService.revokeFriendRequest(senderId, friendRequest.targetId(), friendRequest.friendRequestId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("Friend request revoked successfully!");
    }

    @PostMapping("/accept")
    public ResponseEntity<String> acceptFriendRequest(@RequestHeader("sub") Long receiverId, @RequestBody FriendRequest friendRequest) {
        try {
            friendService.acceptFriendRequest(receiverId, friendRequest.targetId(), friendRequest.friendRequestId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("Friend request accepted successfully!");
    }

    @PostMapping("/block")
    public ResponseEntity<String> blockFriendRequest(@RequestHeader("sub") Long senderId, @RequestBody FriendRequestCreate friendRequest) {
        try {
            friendService.blockFriendRequest(senderId, friendRequest.targetId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("Friend request blocked successfully!");
    }

    @DeleteMapping("/unblock")
    public ResponseEntity<String> unblockFriendRequest(@RequestHeader("sub") Long senderId, @RequestBody FriendRequest friendRequest) {
        try {
            friendService.unblockFriendRequest(senderId, friendRequest.targetId(), friendRequest.friendRequestId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("Friend request unblocked successfully!");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFriend(@RequestHeader("sub") Long senderId, @RequestBody FriendRequest friendRequest) {
        try {
            friendService.removeFriend(senderId, friendRequest.targetId(), friendRequest.friendRequestId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("Friend removed successfully!");
    }
}
