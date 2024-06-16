package vn.edu.iuh.fit.postservice.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.postservice.dto.PostDetail;
import vn.edu.iuh.fit.postservice.dto.PostRequest;
import vn.edu.iuh.fit.postservice.entity.neo4j.PostNode;
import vn.edu.iuh.fit.postservice.service.CommentService;
import vn.edu.iuh.fit.postservice.service.PostService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;
    private final CommentService commentService;

    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<PostDetail>> getPosts(@RequestHeader("sub") Long id) {
        return ResponseEntity.ok(postService.findPostsByUserId(id));
    }

    @GetMapping("/wall/{id}")
    public ResponseEntity<Map<String, PostDetail>> getUserWall(
            @PathVariable Long id,
            @RequestParam("page") int page,
            @RequestParam("size") int size) {
        return ResponseEntity.ok().body(postService.findUserWall(id, --page, size));
    }

    @GetMapping("/new-feed")
    public ResponseEntity<Map<String, PostDetail>> getNewFeed(
            @RequestHeader("sub") Long id,
            @RequestParam("page") int page,
            @RequestParam("size") int size) {
        return ResponseEntity.ok().body(postService.findNewFeed(id, --page, size));
    }

    @PostMapping
    public ResponseEntity<String> savePost(@RequestHeader("sub") Long id, @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.savePost(id, request.coAuthor(), request.content(), request.media()));
    }
}
