package vn.edu.iuh.fit.postservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.postservice.dto.PostDetail;
import vn.edu.iuh.fit.postservice.dto.PostRequest;
import vn.edu.iuh.fit.postservice.dto.ShareRequest;
import vn.edu.iuh.fit.postservice.entity.neo4j.Category;
import vn.edu.iuh.fit.postservice.entity.neo4j.CategoryNode;
import vn.edu.iuh.fit.postservice.repository.neo4j.CategoryNodeRepository;
import vn.edu.iuh.fit.postservice.service.PostService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<PostDetail>> getPosts(@RequestHeader("sub") Long id) {
        return ResponseEntity.ok(postService.findPostsByUserId(id));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDetail> getPost(@PathVariable("postId") String postId) {
        return ResponseEntity.ok(postService.findPostById(postId));
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
        return ResponseEntity.ok(postService.savePost(id, request.coAuthor(), request.content(), request.media(), request.category()));
    }

    @PostMapping("/share")
    public ResponseEntity<String> sharePost(@RequestHeader("sub") Long id, @RequestBody ShareRequest request) {
        return ResponseEntity.ok(postService.sharePost(id, request.postId(), request.content()));
    }
}
