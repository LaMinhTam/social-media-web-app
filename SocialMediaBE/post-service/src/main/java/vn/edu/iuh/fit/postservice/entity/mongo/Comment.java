package vn.edu.iuh.fit.postservice.entity.mongo;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comment {
    @MongoId
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String content;
    private List<String> media;
    private Long author;
    private List<Long> tags;
    @Column(name = "create_at")
    private Date createAt;
    @Column(name = "update_at")
    private Date updateAt;

    public Comment(String content, List<String> media, Long author, List<Long> tags, Date createAt, Date updateAt) {
        this.content = content;
        this.media = media;
        this.author = author;
        this.tags = tags;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }
}
