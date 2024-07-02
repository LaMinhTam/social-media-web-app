package vn.edu.iuh.fit.postservice.service;

public interface UserService {
    void saveUser(Long userId);

    boolean followUser(Long userId, Long followingId);
}
