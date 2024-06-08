package vn.edu.iuh.fit.userservice.service;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.userservice.entity.User;
import vn.edu.iuh.fit.userservice.model.UserModel;
import vn.edu.iuh.fit.userservice.repository.UserRepository;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(Long id, String name, String email, String imageUrl) {
        return userRepository.save(new User(id, name, email, imageUrl));
    }

    @Override
    public UserModel getUserById(Long userId) throws Exception {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new Exception("User not found"));
        return new UserModel(user.getUserId(), user.getName(), user.getEmail(), user.getImageUrl());
    }

    @Override
    public List<UserModel> searchUser(String keyword) {
        List<User> user = userRepository.findByKeyword(keyword);
        return user.stream().map(u -> new UserModel(u.getUserId(), u.getName(), u.getEmail(), u.getImageUrl())).toList();
    }

    @Override
    public List<UserModel> getUsersByIds(List<Long> ids) {
        List<User> users = userRepository.findByUserIdIn(ids);
        return users.stream().map(u -> new UserModel(u.getUserId(), u.getName(), u.getEmail(), u.getImageUrl())).toList();
    }
}
