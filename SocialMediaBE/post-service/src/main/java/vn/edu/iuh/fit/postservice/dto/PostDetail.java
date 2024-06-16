package vn.edu.iuh.fit.postservice.dto;

import vn.edu.iuh.fit.postservice.entity.mongo.Post;
import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionType;

import java.util.Date;
import java.util.List;
import java.util.Map;

public record PostDetail(
        String postId,
        List<UserDetail> authors,
        String content,
        List<String> media,
        Date createAt,
        Date updateAt,
        Map<ReactionType, Long> reactions
) {
    public PostDetail(Post post, List<UserDetail> authors, Map<ReactionType, Long> reactions) {
        this(post.getId(),
                authors,
                post.getContent(),
                post.getMedia(),
                post.getCreateAt(),
                post.getUpdateAt(),
                reactions);
    }
}
