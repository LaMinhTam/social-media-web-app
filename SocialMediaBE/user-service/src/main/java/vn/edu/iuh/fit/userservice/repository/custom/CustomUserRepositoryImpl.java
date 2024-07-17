package vn.edu.iuh.fit.userservice.repository.custom;

import org.neo4j.cypherdsl.core.Cypher;
import org.neo4j.cypherdsl.core.Statement;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import vn.edu.iuh.fit.userservice.entity.User;

import java.util.List;
import java.util.Map;

import static org.neo4j.cypherdsl.core.Cypher.node;

public class CustomUserRepositoryImpl implements CustomUserRepository {
    private final Neo4jTemplate neo4jTemplate;
    public CustomUserRepositoryImpl(Neo4jTemplate neo4jTemplate) {
        this.neo4jTemplate = neo4jTemplate;
    }

    @Override
    public List<User> findByKeyword(String keyword) {
        //search by multi field from name, email
        Statement statement = Cypher.match(node("User").named("u"))
                .where(Cypher.anyNode("u").property("name").contains(Cypher.literalOf(keyword))
                        .or(Cypher.anyNode("u").property("email").contains(Cypher.literalOf(keyword))))
                .returning("u")
                .build();
        return neo4jTemplate.findAll(statement, Map.of(), User.class);
    }

    @Override
    public List<User> findByUserIdIn(List<Long> ids) {
        //search by list of ids
        Statement statement = Cypher.match(node("User").named("u"))
                .where(Cypher.anyNode("u").property("userId").in(Cypher.literalOf(ids)))
                .returning("u")
                .build();
        return neo4jTemplate.findAll(statement, Map.of(), User.class);
    }
}
