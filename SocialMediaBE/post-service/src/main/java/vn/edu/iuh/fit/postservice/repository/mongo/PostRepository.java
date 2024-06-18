package vn.edu.iuh.fit.postservice.repository.mongo;


import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.fit.postservice.entity.mongo.Post;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByIdIn(List<String> postIds);
}
