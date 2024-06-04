package vn.edu.iuh.fit.userservice.repository.custom;

import vn.edu.iuh.fit.userservice.entity.FriendRelationship;
import vn.edu.iuh.fit.userservice.model.UserModel;

import java.util.List;
import java.util.Optional;

public interface CustomFriendRepository {
    Optional<FriendRelationship> findBySenderAndReceiver(Long senderId, Long receiverId);

    List<UserModel> getSendFriendRequest(Long userId);

    List<UserModel> getReceiveFriendRequest(Long userId);

    List<UserModel> getBlocked(Long userId);

    Optional<FriendRelationship> findBySenderAndFriendRequest(Long senderId, Long friendRequestId, String relationshipType);

    List<UserModel> getFriend(Long userId);

}
