package vn.edu.iuh.fit.userservice.repository.custom;

import org.neo4j.cypherdsl.core.Cypher;
import org.neo4j.cypherdsl.core.Statement;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import vn.edu.iuh.fit.userservice.entity.FriendType;
import vn.edu.iuh.fit.userservice.entity.User;

import java.util.List;
import java.util.Map;

import static org.neo4j.cypherdsl.core.Cypher.node;

public class CustomUserRepositoryImpl implements CustomUserRepository {
    private final Neo4jTemplate neo4jTemplate;
    public CustomUserRepositoryImpl(Neo4jTemplate neo4jTemplate) {
        this.neo4jTemplate = neo4jTemplate;
    }

}
