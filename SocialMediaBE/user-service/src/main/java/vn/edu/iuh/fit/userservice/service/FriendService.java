package vn.edu.iuh.fit.userservice.service;

import vn.edu.iuh.fit.userservice.dto.UserDTO;
import vn.edu.iuh.fit.userservice.entity.FriendRelationship;

import java.util.List;

public interface FriendService {
    FriendRelationship sendFriendRequest(Long senderId, Long receiverId) throws Exception;

    FriendRelationship revokeFriendRequest(Long sender, Long receiverId, Long friendRequestId) throws Exception;

    FriendRelationship acceptFriendRequest(Long senderId, Long receiverId, Long friendRequestId) throws Exception;

    FriendRelationship removeFriend(Long senderId, Long receiverId, Long friendRequestId) throws Exception;

    FriendRelationship blockFriendRequest(Long senderId, Long receiverId) throws Exception;

    FriendRelationship unblockFriendRequest(Long senderId, Long receiverId, Long friendRequestId) throws Exception;

    UserDTO getFriendByType(Long userId, int type) throws Exception;

    List<FriendRelationship> recommendFriends(Long userId) throws Exception;

}
