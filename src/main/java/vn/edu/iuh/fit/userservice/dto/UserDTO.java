package vn.edu.iuh.fit.userservice.dto;

import vn.edu.iuh.fit.userservice.entity.FriendRelationship;
import vn.edu.iuh.fit.userservice.entity.User;
import vn.edu.iuh.fit.userservice.model.UserModel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserDTO {
    private Long userId;
    private Map<Long, UserFriendRequestDTO> sendRequest;
    private Map<Long, UserFriendRequestDTO> receiveRequest;
    private Map<Long, UserFriendRequestDTO> blocked;
    private Map<Long, UserFriendRequestDTO> friends;

    public UserDTO() {
    }

    public UserDTO(Long userId) {
        this.userId = userId;
    }

    public UserDTO(Long userId, Map<Long, UserFriendRequestDTO> sendRequest, Map<Long, UserFriendRequestDTO> receiveRequest, Map<Long, UserFriendRequestDTO> blocked, Map<Long, UserFriendRequestDTO> friends) {
        this.userId = userId;
        this.sendRequest = sendRequest;
        this.receiveRequest = receiveRequest;
        this.blocked = blocked;
        this.friends = friends;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Map<Long, UserFriendRequestDTO> getSendRequest() {
        return sendRequest;
    }

    public void setSendRequest(Map<Long, UserFriendRequestDTO> sendRequest) {
        this.sendRequest = sendRequest;
    }

    public Map<Long, UserFriendRequestDTO> getReceiveRequest() {
        return receiveRequest;
    }

    public void setReceiveRequest(Map<Long, UserFriendRequestDTO> receiveRequest) {
        this.receiveRequest = receiveRequest;
    }

    public Map<Long, UserFriendRequestDTO> getBlocked() {
        return blocked;
    }

    public void setBlocked(Map<Long, UserFriendRequestDTO> blocked) {
        this.blocked = blocked;
    }

    public Map<Long, UserFriendRequestDTO> getFriends() {
        return friends;
    }

    public void setFriends(Map<Long, UserFriendRequestDTO> friends) {
        this.friends = friends;
    }

    public static Map<Long, UserFriendRequestDTO> convertToUserDTO(Map<Long, Long> relationships, List<UserModel> userModel) {
        Map<Long, UserFriendRequestDTO> list = new HashMap<>();
        userModel.forEach(user -> {
            Long friendRelationshipId = relationships.get(user.userId());
            if (friendRelationshipId != null) {
                list.put(user.userId(), new UserFriendRequestDTO(
                        friendRelationshipId,
                        user.userId(),
                        user.name(),
                        user.email(),
                        user.imageUrl()));
            }
        });
        return list;
    }
}
