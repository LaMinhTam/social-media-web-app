package vn.edu.iuh.fit.postservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.postservice.dto.CommentRequest;
import vn.edu.iuh.fit.postservice.dto.SortStrategy;
import vn.edu.iuh.fit.postservice.service.CommentService;

@RestController
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComment(@PathVariable String id, @RequestParam int page, @RequestParam int size, @RequestParam(required = false) SortStrategy sort) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(id, sort, --page, size));
    }

    @PostMapping
    public ResponseEntity<String> saveComment(@RequestHeader("sub") Long id, @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.saveComment(id, request.postId(), request.content(), request.media(), request.tags(), request.parentCommentId()));
    }
}
