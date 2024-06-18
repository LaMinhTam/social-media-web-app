package vn.edu.iuh.fit.postservice.service;

public interface UserService {
    void saveUser(Long userId);

    void followUser(Long userId, Long followingId);
}
