package vn.edu.iuh.fit.userservice.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.userservice.entity.User;
import vn.edu.iuh.fit.userservice.exception.AppException;
import vn.edu.iuh.fit.userservice.model.UserModel;
import vn.edu.iuh.fit.userservice.repository.UserRepository;
import vn.edu.iuh.fit.userservice.service.UserService;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(Long id, String name, String email, String imageUrl, String cover) {
        return userRepository.save(new User(id, name, email, imageUrl, cover));
    }

    @Override
    public UserModel getUserById(Long userId) {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new AppException(404, "User not found"));
        return new UserModel(user.getUserId(), user.getName(), user.getEmail(), user.getImageUrl(), user.getCover());
    }

    @Override
    public List<UserModel> searchUser(String keyword) {
        List<User> users = userRepository.findByKeyword(keyword);
        return UserModel.convertToUserModel(users);
    }

    @Override
    public List<UserModel> getUsersByIds(List<Long> ids) {
        List<User> users = userRepository.findByUserIdIn(ids);
        return UserModel.convertToUserModel(users);
    }

    @Override
    public UserModel updateUser(Long userId, String name, String email, String s, String cover) {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new AppException(404, "User not found"));
        user.setName(name);
        user.setImageUrl(s);
        user.setCover(cover);
        User savedUser = userRepository.save(user);
        return new UserModel(savedUser);
    }
}
