package vn.edu.iuh.fit.postservice.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.postservice.entity.neo4j.UserNode;
import vn.edu.iuh.fit.postservice.repository.neo4j.UserNodeRepository;
import vn.edu.iuh.fit.postservice.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    private final UserNodeRepository userNodeRepository;

    public UserServiceImpl(UserNodeRepository userNodeRepository) {
        this.userNodeRepository = userNodeRepository;
    }

    @Override
    public void saveUser(Long userId) {
        userNodeRepository.save(new UserNode(userId));
    }

    @Override
    public void followUser(Long userId, Long followingId) {
        UserNode user = userNodeRepository.findById(userId).orElseThrow();
        UserNode following = userNodeRepository.findById(followingId).orElseThrow();
        user.getFollowing().add(following);
        userNodeRepository.save(user);
    }
}
