package vn.edu.iuh.fit.userservice.service.impl;

import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;
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
        int maxAttempts = 3;
        int attempt = 0;
        long backoffDelay = 5000; // milliseconds

        while (attempt < maxAttempts) {
            try {
                return userRepository.save(new User(id, name, email, imageUrl, cover));
            } catch (Exception e) {
                attempt++;
                if (attempt >= maxAttempts) {
                    throw e; // Rethrow exception if max attempts reached
                }
                try {
                    Thread.sleep(backoffDelay); // Wait before retrying
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt(); // Restore interrupted status
                    throw new RuntimeException("Thread was interrupted during backoff", ie);
                }
            }
        }

        throw new RuntimeException("Should never reach here");
    }


    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public UserModel getUserById(Long userId) {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new AppException(404, "User not found"));
        return new UserModel(user.getUserId(), user.getName(), user.getEmail(), user.getImageUrl(), user.getCover());
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public List<UserModel> searchUser(String keyword) {
        List<User> users = userRepository.findByKeyword(keyword);
        return UserModel.convertToUserModel(users);
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public List<UserModel> getUsersByIds(List<Long> ids) {
        List<User> users = userRepository.findByUserIdIn(ids);
        return UserModel.convertToUserModel(users);
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public UserModel updateUser(Long userId, String name, String email, String s, String cover) {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new AppException(404, "User not found"));
        user.setName(name);
        user.setImageUrl(s);
        user.setCover(cover);
        User savedUser = userRepository.save(user);
        return new UserModel(savedUser);
    }
}
