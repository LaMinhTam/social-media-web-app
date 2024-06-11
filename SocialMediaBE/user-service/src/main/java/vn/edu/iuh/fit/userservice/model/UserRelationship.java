package vn.edu.iuh.fit.userservice.model;

import vn.edu.iuh.fit.userservice.entity.FriendRelationship;
import vn.edu.iuh.fit.userservice.entity.User;

import java.util.Map;
import java.util.stream.Collectors;

//with key is user id and value is friend relationship id
public record UserRelationship(
        Map<Long, Long> sendRequest,
        Map<Long, Long> receiveRequest,
        Map<Long, Long> blocked,
        Map<Long, Long> friends
) {
    public UserRelationship(User user) {
        this(
                user.getSentRequests().stream().collect(
                        Collectors.toMap(FriendRelationship::getTargetUser, FriendRelationship::getId)
                ),
                user.getReceivedRequests().stream().collect(
                        Collectors.toMap(FriendRelationship::getSourceUser, FriendRelationship::getId)
                ),
                user.getBlocked().stream().collect(
                        Collectors.toMap(FriendRelationship::getTargetUser, FriendRelationship::getId)
                ),
                combineFriendMaps(user)
        );
    }

    private static Map<Long, Long> combineFriendMaps(User user) {
        Map<Long, Long> friendMap = user.getFriends().stream()
                .collect(Collectors.toMap(FriendRelationship::getSourceUser, FriendRelationship::getId));
        Map<Long, Long> targetMap = user.getFriends().stream()
                .collect(Collectors.toMap(FriendRelationship::getTargetUser, FriendRelationship::getId));
        friendMap.putAll(targetMap);
        return friendMap;
    }
}
