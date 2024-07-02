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
public class Post {
    @MongoId
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "_id")
    private String id;
    private String content;
    private List<String> media;
    @Column(name = "create_at")
    private Date createAt;
    @Column(name = "update_at")
    private Date updateAt;

    public Post(String content) {
        this.content = content;
        this.updateAt = new Date();
        this.createAt = new Date();
    }

    public Post(String content, List<String> media) {
        this.content = content;
        this.media = media;
        this.updateAt = new Date();
        this.createAt = new Date();
    }
}
