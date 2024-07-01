package vn.edu.iuh.fit.userservice.dto;

public class UserFriendRequestDTO {
    private Long friendRequestId;
    private Long userId;
    private String name;
    private String email;
    private String imageUrl;

    public UserFriendRequestDTO() {
    }

    public UserFriendRequestDTO(Long userId) {
        this.userId = userId;
    }

    public UserFriendRequestDTO(Long friendRequestId, Long userId, String name, String email, String imageUrl) {
        this.friendRequestId = friendRequestId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
    }

    public Long getFriendRequestId() {
        return friendRequestId;
    }

    public void setFriendRequestId(Long friendRequestId) {
        this.friendRequestId = friendRequestId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
