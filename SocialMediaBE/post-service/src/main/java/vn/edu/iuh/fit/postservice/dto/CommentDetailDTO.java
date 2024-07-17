package vn.edu.iuh.fit.postservice.dto;

import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionType;

import java.util.Date;
import java.util.List;
import java.util.Map;

public record CommentDetailDTO(
        String commentId,
        String content,
        List<String> media,
        UserDetail author,
        List<UserDetail> tags,
        Date createAt,
        Date updateAt,
        List<CommentDetailDTO> childComments,
        Map<ReactionType, Long> reactions
) {
}
