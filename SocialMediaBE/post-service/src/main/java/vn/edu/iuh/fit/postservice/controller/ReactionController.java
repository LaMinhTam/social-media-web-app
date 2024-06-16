package vn.edu.iuh.fit.postservice.controller;

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
    public ResponseEntity<Long> reactToPost(@RequestHeader("sub") Long id, @RequestBody ReactRequest reactRequest) {
        return ResponseEntity.ok(reactionService.reactToPost(reactRequest.target(), id, reactRequest.type()));
    }

    @PostMapping("/comment")
    public ResponseEntity<Long> reactToComment(@RequestHeader("sub") Long id, @RequestBody ReactRequest reactRequest) {
        return ResponseEntity.ok(reactionService.reactToComment(reactRequest.target(), id, reactRequest.type()));
    }
}
