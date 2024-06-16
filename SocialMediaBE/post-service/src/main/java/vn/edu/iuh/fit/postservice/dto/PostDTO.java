package vn.edu.iuh.fit.postservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private String postId;
    private Long authorId;
    private Date createdAt;
    private Date updatedAt;
}
