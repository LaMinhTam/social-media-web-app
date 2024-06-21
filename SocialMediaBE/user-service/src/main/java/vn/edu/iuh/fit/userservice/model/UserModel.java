package vn.edu.iuh.fit.userservice.model;

import vn.edu.iuh.fit.userservice.entity.User;

import java.util.List;

public record UserModel (Long userId, String name, String email, String imageUrl, String cover) {
    public static List<UserModel> convertToUserModel(List<User> users) {
        return users.stream().map(user -> new UserModel(user.getUserId(), user.getName(), user.getEmail(), user.getImageUrl(), user.getCover())).toList();
    }
}
