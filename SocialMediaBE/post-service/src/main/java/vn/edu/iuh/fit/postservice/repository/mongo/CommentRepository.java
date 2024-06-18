package vn.edu.iuh.fit.postservice.repository.mongo;


import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.fit.postservice.entity.mongo.Comment;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByIdIn(List<String> ids);
}
