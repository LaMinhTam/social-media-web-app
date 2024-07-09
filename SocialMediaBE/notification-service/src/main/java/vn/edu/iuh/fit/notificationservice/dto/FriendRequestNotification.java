package vn.edu.iuh.fit.notificationservice.dto;

public class FriendRequestNotification {
    private Long friendRequestId;
    private Long userId;
    private String name;
    private String email;
    private String imageUrl;
    private String type;

    public FriendRequestNotification() {
    }

    public FriendRequestNotification(Long friendRequestId, String type) {
        this.friendRequestId = friendRequestId;
        this.type = type;
    }

    public FriendRequestNotification(Long friendRequestId, Long userId, String name, String email, String imageUrl, String type) {
        this.friendRequestId = friendRequestId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
        this.type = type;
    }

    public Long getFriendRequestId() {
        return friendRequestId;
    }

    public void setFriendRequestId(Long friendRequestId) {
        this.friendRequestId = friendRequestId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}