package vn.edu.iuh.fit.userservice.service;

import vn.edu.iuh.fit.userservice.entity.User;
import vn.edu.iuh.fit.userservice.model.UserModel;

import java.util.List;

public interface UserService {
    public User createUser(Long id, String name, String email, String imageUrl);

    UserModel getUserById(Long userId);

    List<UserModel> searchUser(String keyword);

    List<UserModel> getUsersByIds(List<Long> ids);
}
