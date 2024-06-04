package vn.edu.iuh.fit.userservice.service;

import vn.edu.iuh.fit.userservice.entity.User;

public interface UserService {
    public User createUser(Long id, String name, String email, String imageUrl);

    User getUserById(Long userId) throws Exception;
}
