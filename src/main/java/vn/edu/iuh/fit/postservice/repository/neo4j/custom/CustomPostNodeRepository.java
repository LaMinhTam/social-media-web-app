package vn.edu.iuh.fit.postservice.repository.neo4j.custom;

import vn.edu.iuh.fit.postservice.dto.PostDTO;

import java.util.List;

public interface CustomPostNodeRepository {
    List<PostDTO> findNewFeed(Long userId, int page, int size);

    List<PostDTO> findUserWall(Long userId, int page, int size);
}
