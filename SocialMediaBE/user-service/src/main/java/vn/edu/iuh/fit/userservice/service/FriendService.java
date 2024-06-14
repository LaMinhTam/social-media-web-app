package vn.edu.iuh.fit.userservice.service;

import vn.edu.iuh.fit.userservice.dto.UserDTO;
import vn.edu.iuh.fit.userservice.entity.FriendRelationship;

import java.util.List;

public interface FriendService {
    FriendRelationship sendFriendRequest(Long senderId, Long receiverId);

    FriendRelationship revokeFriendRequest(Long sender, Long receiverId, Long friendRequestId);

    FriendRelationship acceptFriendRequest(Long receiverId, Long senderId, Long friendRequestId);

    FriendRelationship removeFriend(Long senderId, Long receiverId, Long friendRequestId);

    FriendRelationship blockFriendRequest(Long senderId, Long receiverId);

    FriendRelationship unblockFriendRequest(Long senderId, Long receiverId, Long friendRequestId);

    UserDTO getFriendByType(Long userId, int type);

    List<FriendRelationship> recommendFriends(Long userId);

}
