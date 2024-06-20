package vn.edu.iuh.fit.postservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.postservice.dto.ReactRequest;
import vn.edu.iuh.fit.postservice.service.ReactionService;

@RestController
@RequestMapping("/reactions")
public class ReactionController {
    private final ReactionService reactionService;

    public ReactionController(ReactionService reactionService) {
        this.reactionService = reactionService;
    }

    @PostMapping("/post")
    public ResponseEntity<?> reactToPost(@RequestHeader("sub") Long id, @RequestBody ReactRequest reactRequest) {
        if(reactionService.reactToPost(reactRequest.target(), id, reactRequest.type())){
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.status(HttpStatus.GONE).build();
        }
    }

    @PostMapping("/comment")
    public ResponseEntity<Long> reactToComment(@RequestHeader("sub") Long id, @RequestBody ReactRequest reactRequest) {
        if(reactionService.reactToComment(reactRequest.target(), id, reactRequest.type())){
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.status(HttpStatus.GONE).build();
        }
    }

    @GetMapping("/post/detail/{postId}")
    public ResponseEntity<?> getReaction(@RequestHeader("sub") Long id, @PathVariable String postId) {
        return ResponseEntity.ok(reactionService.getPostReaction(id, postId));
    }

    @GetMapping("/comment/detail/{commentId}")
    public ResponseEntity<?> getCommentReaction(@RequestHeader("sub") Long id, @PathVariable String commentId) {
        return ResponseEntity.ok(reactionService.getCommentReaction(id, commentId));
    }
}
