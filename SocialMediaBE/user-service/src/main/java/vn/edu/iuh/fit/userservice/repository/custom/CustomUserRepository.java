package vn.edu.iuh.fit.userservice.repository.custom;

import vn.edu.iuh.fit.userservice.entity.User;

import java.util.List;

public interface CustomUserRepository {
    List<User> findByKeyword(String keyword);

    List<User> findByUserIdIn(List<Long> ids);
}
