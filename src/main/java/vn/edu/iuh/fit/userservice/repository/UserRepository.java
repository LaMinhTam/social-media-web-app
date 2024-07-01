package vn.edu.iuh.fit.userservice.repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import vn.edu.iuh.fit.userservice.entity.User;
import vn.edu.iuh.fit.userservice.repository.custom.CustomUserRepository;

import java.util.Optional;

public interface UserRepository extends Neo4jRepository<User, Long>, CustomUserRepository {
    Optional<User> findByUserId(Long senderId);
}