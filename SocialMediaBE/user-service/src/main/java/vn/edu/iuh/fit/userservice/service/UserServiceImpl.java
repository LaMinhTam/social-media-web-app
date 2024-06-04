package vn.edu.iuh.fit.userservice.service;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.userservice.entity.User;
import vn.edu.iuh.fit.userservice.repository.UserRepository;

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
    public User getUserById(Long userId) throws Exception {
        return userRepository.findByUserId(userId).orElseThrow(() -> new Exception("User not found"));
    }
}
