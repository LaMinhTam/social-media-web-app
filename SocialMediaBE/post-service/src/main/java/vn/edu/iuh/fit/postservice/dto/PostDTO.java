package vn.edu.iuh.fit.postservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private String postId;
    private List<Long> authorId;
    private Date createdAt;
    private Date updatedAt;
    private PostDTO originalPost;

    public PostDTO(PostDTO postDTO) {
        this.postId = postDTO.getPostId();
        this.authorId = postDTO.getAuthorId();
        this.createdAt = postDTO.getCreatedAt();
        this.updatedAt = postDTO.getUpdatedAt();
        this.originalPost = postDTO.getOriginalPost();
    }

    public static PostDTO convertFromObject(Map<String, Object> properties) {
        return new PostDTO(
                properties.get("postId").toString(),
                (List<Long>) properties.get("authors"),
                Date.from(Instant.parse(properties.get("createdAt").toString())),
                Date.from(Instant.parse(properties.get("updatedAt").toString())),
                properties.get("originalPost") != null ? new PostDTO(PostDTO.convertFromObject((Map<String, Object>) properties.get("originalPost"))) : null
        );
    }
}
