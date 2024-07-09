package vn.edu.iuh.fit.userservice.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import vn.edu.iuh.fit.userservice.dto.FriendRequestDTO;
import vn.edu.iuh.fit.userservice.dto.FriendStatus;
import vn.edu.iuh.fit.userservice.dto.UserDTO;
import vn.edu.iuh.fit.userservice.entity.FriendRelationship;
import vn.edu.iuh.fit.userservice.entity.FriendType;
import vn.edu.iuh.fit.userservice.entity.User;
import vn.edu.iuh.fit.userservice.exception.AppException;
import vn.edu.iuh.fit.userservice.message.FriendRequestNotificationProducer;
import vn.edu.iuh.fit.userservice.model.UserModel;
import vn.edu.iuh.fit.userservice.model.UserRelationship;
import vn.edu.iuh.fit.userservice.repository.FriendRepository;
import vn.edu.iuh.fit.userservice.repository.UserRepository;
import vn.edu.iuh.fit.userservice.service.FriendService;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class FriendServiceImpl implements FriendService {

    private final UserRepository userRepository;
    private final FriendRepository friendRepository;
    private final FriendRequestNotificationProducer friendRequestNotificationProducer;
    @Autowired
    public FriendServiceImpl(UserRepository userRepository, FriendRepository friendRepository, FriendRequestNotificationProducer friendRequestNotificationProducer) {
        this.userRepository = userRepository;
        this.friendRepository = friendRepository;
        this.friendRequestNotificationProducer = friendRequestNotificationProducer;
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public FriendRelationship sendFriendRequest(Long senderId, Long receiverId) {
        if (senderId.equals(receiverId)) {
            throw new AppException(400, "Cannot send friend request to yourself");
        }

        User sender = userRepository.findByUserId(senderId).orElseThrow(() -> new AppException(404, "User not found"));
        User receiver = userRepository.findByUserId(receiverId).orElseThrow(() -> new AppException(404, "User not found"));

        Optional<FriendRelationship> existingFriendRequest = friendRepository.findBySenderAndReceiver(senderId, receiverId);
        if (existingFriendRequest.isPresent()) {
            throw new AppException(400, "Friend request already sent");
        }

        FriendRelationship friendRequest = new FriendRelationship();
        friendRequest.setTargetUser(receiverId);
        friendRequest.setSourceUser(senderId);
        friendRequest.setCreatedAt(new Date());
        friendRequest.setUpdatedAt(new Date());

        FriendRelationship savedFriendRelationship = friendRepository.save(friendRequest);

        sender.getSentRequests().add(friendRequest);
        receiver.getReceivedRequests().add(friendRequest);

        userRepository.save(sender);
        userRepository.save(receiver);
        friendRequestNotificationProducer.sendFriendRequestNotification(new FriendRequestDTO(savedFriendRelationship.getId(), receiverId, senderId, "SEND"));
        return savedFriendRelationship;
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public FriendRelationship revokeFriendRequest(Long senderId, Long receiverId, Long friendRequestId) {
        userRepository.findByUserId(senderId).orElseThrow(() -> new AppException(404, "User not found"));
        User receiver = userRepository.findByUserId(receiverId).orElseThrow(() -> new AppException(404, "User not found"));

        FriendRelationship friendRequest = friendRepository.findBySenderAndFriendRequest(senderId, friendRequestId, "SEND").orElseThrow(() -> new AppException(404, "Friend request not found"));
        if (!friendRequest.getTargetUser().equals(receiver.getUserId())) {
            throw new AppException(404, "Friend request not found");
        }

        friendRepository.deleteById(friendRequest.getId());
        friendRequestNotificationProducer.sendFriendRequestNotification(new FriendRequestDTO(friendRequestId, receiverId, senderId, "REVOKE"));
        return friendRequest;
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public FriendRelationship acceptFriendRequest(Long receiverId, Long senderId, Long friendRequestId) {
        User sender = userRepository.findByUserId(senderId).orElseThrow(() -> new AppException(404, "User not found"));
        User receiver = userRepository.findByUserId(receiverId).orElseThrow(() -> new AppException(404, "User not found"));

        FriendRelationship friendRequest = friendRepository.findBySenderAndFriendRequest(senderId, friendRequestId, "SEND").orElseThrow(() -> new AppException(404, "Friend request not found"));
        if (!friendRequest.getTargetUser().equals(receiver.getUserId())) {
            throw new AppException(404, "Friend request not found");
        }
        friendRequest.setUpdatedAt(new Date());

        sender.getSentRequests().remove(friendRequest);
        receiver.getReceivedRequests().remove(friendRequest);
        sender.getFriends().add(friendRequest);
        receiver.getFriends().add(friendRequest);
        friendRepository.updateByIdAndStatus(friendRequest.getId(), FriendType.ACCEPTED);
        userRepository.save(sender);
        userRepository.save(receiver);
        friendRequestNotificationProducer.sendFriendRequestNotification(new FriendRequestDTO(friendRequestId, receiverId, senderId, "ACCEPT"));

        return friendRequest;
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public FriendRelationship removeFriend(Long senderId, Long receiverId, Long friendRequestId) {
        userRepository.findByUserId(senderId).orElseThrow(() -> new AppException(404, "User not found"));
        User receiver = userRepository.findByUserId(receiverId).orElseThrow(() -> new AppException(404, "User not found"));

        FriendRelationship friendRequest = friendRepository.findBySenderAndFriendRequest(senderId, friendRequestId, "FRIEND")
                .orElseThrow(() -> new AppException(404, "Friend request not found"));
        if (!friendRequest.getTargetUser().equals(receiver.getUserId())) {
            throw new AppException(404, "Friend request not found");
        }

        friendRepository.deleteById(friendRequest.getId());

        return friendRequest;
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public FriendRelationship blockFriendRequest(Long senderId, Long receiverId) {
        User sender = userRepository.findByUserId(senderId).orElseThrow(() -> new AppException(404, "User not found"));
        User receiver = userRepository.findByUserId(receiverId).orElseThrow(() -> new AppException(404, "User not found"));

        FriendRelationship friendRequest = new FriendRelationship();
        friendRequest.setTargetUser(receiverId);
        friendRequest.setSourceUser(senderId);
        friendRequest.setCreatedAt(new Date());
        friendRequest.setUpdatedAt(new Date());

        sender.getBlocked().add(friendRequest);
        receiver.getBlockedBy().add(friendRequest);

        friendRepository.save(friendRequest);
        userRepository.save(sender);
        userRepository.save(receiver);

        return friendRequest;
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public FriendRelationship unblockFriendRequest(Long senderId, Long receiverId, Long friendRequestId) {
        userRepository.findByUserId(senderId).orElseThrow(() -> new AppException(404, "User not found"));
        User receiver = userRepository.findByUserId(receiverId).orElseThrow(() -> new AppException(404, "User not found"));

        FriendRelationship blockedRequest = friendRepository.findBySenderAndFriendRequest(senderId, friendRequestId, "BLOCK")
                .orElseThrow(() -> new AppException(404, "Blocked friend request not found"));
        if (!blockedRequest.getTargetUser().equals(receiver.getUserId())) {
            throw new AppException(404, "Friend request not found");
        }

        friendRepository.delete(blockedRequest);

        return blockedRequest;
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public UserDTO getFriendByType(Long userId, int type) {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new AppException(404, "User not found"));

        UserRelationship userRelationship = new UserRelationship(user);
        UserDTO userDTO = new UserDTO(userId);
        if (type == FriendStatus.ALL.getValue()) {
            userDTO = new UserDTO(
                    userId,
                    UserDTO.convertToUserDTO(userRelationship.sendRequest(), friendRepository.getSendFriendRequest(userId)),
                    UserDTO.convertToUserDTO(userRelationship.receiveRequest(), friendRepository.getReceiveFriendRequest(userId)),
                    UserDTO.convertToUserDTO(userRelationship.blocked(), friendRepository.getBlocked(userId)),
                    UserDTO.convertToUserDTO(userRelationship.friends(), friendRepository.getFriend(userId))
            );
        } else if (type == FriendStatus.SENT.getValue()) {
            userDTO.setSendRequest(UserDTO.convertToUserDTO(userRelationship.sendRequest(), friendRepository.getSendFriendRequest(userId)));
        } else if (type == FriendStatus.RECEIVED.getValue()) {
            userDTO.setReceiveRequest(UserDTO.convertToUserDTO(userRelationship.receiveRequest(), friendRepository.getReceiveFriendRequest(userId)));
        } else if (type == FriendStatus.BLOCKED.getValue()) {
            userDTO.setBlocked(UserDTO.convertToUserDTO(userRelationship.blocked(), friendRepository.getBlocked(userId)));
        } else if (type == FriendStatus.FRIEND.getValue()) {
            userDTO.setFriends(UserDTO.convertToUserDTO(userRelationship.friends(), friendRepository.getFriend(userId)));
        }
        return userDTO;
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public List<FriendRelationship> recommendFriends(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(404, "User not found"));

//        List<User> friends = user.getFriends();
//        Set<User> recommendedFriends = new HashSet<>();
//
//        for (User friend : friends) {
//            List<User> friendsOfFriend = friend.getFriends();
//            for (User potentialFriend : friendsOfFriend) {
//                if (!friends.contains(potentialFriend) && !potentialFriend.equals(user)) {
//                    recommendedFriends.add(potentialFriend);
//                }
//            }
//        }
//
//        List<FriendRelationship> recommendedFriendRelationships = new ArrayList<>();
//        for (User recommendedFriend : recommendedFriends) {
//            FriendRelationship relationship = new FriendRelationship();
//            relationship.setTargetUser(recommendedFriend);
//            // Populate other properties if needed
//            recommendedFriendRelationships.add(relationship);
//        }

//        return recommendedFriendRelationships;
        return null;
    }

    @Override
    @Retryable(
            value = { TransactionSystemException.class, DataAccessResourceFailureException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
    )
    public List<UserModel> getFriend(Long userId) {
        return friendRepository.getFriend(userId);
    }
}
