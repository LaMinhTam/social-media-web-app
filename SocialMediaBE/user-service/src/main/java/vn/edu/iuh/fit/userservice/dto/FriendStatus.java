package vn.edu.iuh.fit.userservice.dto;

public enum FriendStatus {
    ALL(0), SENT(1), RECEIVED(2), BLOCKED(3), FRIEND(4);

    private final int value;

    FriendStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
