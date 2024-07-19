package vn.edu.iuh.fit.postservice.service.impl;

import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.iuh.fit.postservice.entity.neo4j.UserNode;
import vn.edu.iuh.fit.postservice.repository.neo4j.UserNodeRepository;
import vn.edu.iuh.fit.postservice.service.UserService;

@Service
@Transactional("transactionManager")
public class UserServiceImpl implements UserService {
    private final UserNodeRepository userNodeRepository;

    public UserServiceImpl(UserNodeRepository userNodeRepository) {
        this.userNodeRepository = userNodeRepository;
    }

    @Override
    public void saveUser(Long userId) {
        int maxAttempts = 3;
        int attempt = 0;
        long backoffDelay = 5000; // milliseconds

        while (attempt < maxAttempts) {
            try {
                userNodeRepository.save(new UserNode(userId));
                return; // Successfully saved, exit the method
            } catch (TransactionSystemException | DataAccessResourceFailureException e) {
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

        // Should not reach this point due to the rethrow logic
        throw new RuntimeException("Should never reach here");
    }

    @Override
    @Retryable(value = {TransactionSystemException.class, DataAccessResourceFailureException.class}, maxAttempts = 3, backoff = @Backoff(delay = 5000))
    public boolean followUser(Long userId, Long followingId) {
        UserNode user = userNodeRepository.findById(userId).orElseThrow();
        UserNode following = userNodeRepository.findById(followingId).orElseThrow();
        boolean result = true;
        if(user.getFollowing().contains(following)) {
            result = false;
            userNodeRepository.removeFollowing(userId, followingId);
        }else{
            user.getFollowing().add(following);
            userNodeRepository.save(user);
        }
        return result;
    }
}
