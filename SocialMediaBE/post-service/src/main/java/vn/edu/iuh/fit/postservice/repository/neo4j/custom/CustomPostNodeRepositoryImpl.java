package vn.edu.iuh.fit.postservice.repository.neo4j.custom;

import org.neo4j.cypherdsl.core.*;
import org.neo4j.driver.internal.InternalNode;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.fit.postservice.dto.PostDTO;

import java.time.Instant;
import java.util.*;
import java.util.Set;

import static org.neo4j.cypherdsl.core.Cypher.*;

@Repository
public class CustomPostNodeRepositoryImpl implements CustomPostNodeRepository {
    private final Neo4jClient neo4jClient;

    public CustomPostNodeRepositoryImpl(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    @Override
    public List<PostDTO> findNewFeed(Long userId, int page, int size) {
        int skip = page * size;
        int limit = size;

        Collection<Map<String, Object>> results = neo4jClient.query((
                        "MATCH (u:UserNode)-[:AUTHORED_BY]->(p:PostNode) " +
                                "OPTIONAL MATCH (p)<-[:REACTION]-(r:ReactionNode) " +
                                "OPTIONAL MATCH (p)-[:SHARE_OF]->(original:PostNode) " +
                                "OPTIONAL MATCH (p)<-[:AUTHORED_BY]-(author:UserNode) " +
                                "OPTIONAL MATCH (original)<-[:AUTHORED_BY]-(originalAuthor:UserNode) " +
                                " " +
                                "WITH p, u.userId AS userId, COUNT(r) AS reactionCount,  " +
                                "     COLLECT(DISTINCT author.userId) AS authors,  " +
                                "     original,  " +
                                "     COLLECT(DISTINCT originalAuthor.userId) AS originalAuthors, " +
                                "     duration.inDays(datetime(p.createdAt), datetime()).days AS daysSinceCreation " +
                                " " +
                                "WITH p, userId, reactionCount, authors, original, originalAuthors, daysSinceCreation, " +
                                "     CASE " +
                                "       WHEN reactionCount > 0 THEN 1.0 * reactionCount " +
                                "       ELSE 0 " +
                                "     END AS baseScore, " +
                                "     CASE " +
                                "       WHEN daysSinceCreation <= 7 THEN 1.5 " +
                                "       WHEN daysSinceCreation <= 14 THEN 1.2 " +
                                "       WHEN daysSinceCreation <= 21 THEN 1.0 " +
                                "       ELSE 0.8 " +
                                "     END AS recencyMultiplier " +
                                " " +
                                "WITH p, userId, reactionCount, authors, original, originalAuthors, daysSinceCreation,  " +
                                "     baseScore, recencyMultiplier, " +
                                "     (baseScore * recencyMultiplier - (daysSinceCreation / 7) * 1.0) AS finalScore " +
                                " " +
                                "ORDER BY finalScore DESC " +
                                "SKIP $skip " +
                                "LIMIT $limit " +
                                " " +
                                "RETURN COLLECT(DISTINCT p { " +
                                "  .*,  " +
                                "  authors: authors, " +
                                "  originalPost: CASE  " +
                                "    WHEN original IS NOT NULL  " +
                                "    THEN original { " +
                                "      .*,  " +
                                "      authors: originalAuthors, " +
                                "      createdAt: original.createdAt,  " +
                                "      postId: original.postId,  " +
                                "      updatedAt: original.updatedAt  " +
                                "    }  " +
                                "    ELSE NULL  " +
                                "  END " +
                                "}) AS posts; "
                ))
                .bindAll(Map.of("skip", skip, "limit", limit)).fetch().all();
        List<PostDTO> postDTOS = new ArrayList<>();
        results.forEach(result -> {
            List<Map<String, Object>> nodes = (List<Map<String, Object>>) result.get("posts");
            nodes.forEach(properties -> {
                postDTOS.add(new PostDTO(
                        PostDTO.convertFromObject(properties)
                ));
            });
        });
        return postDTOS;
    }

    @Override
    public List<PostDTO> findUserWall(Long userId, int page, int size) {
        int skip = page * size;
        int limit = size;

        Collection<Map<String, Object>> results = neo4jClient.query(
                        "MATCH (u:UserNode {userId: $userId})-[:AUTHORED_BY]->(p:PostNode) " +
                                "OPTIONAL MATCH (p)-[:SHARE_OF]->(original:PostNode) " +
                                "OPTIONAL MATCH (p)<-[:AUTHORED_BY]-(author:UserNode) " +
                                "OPTIONAL MATCH (original)<-[:AUTHORED_BY]-(originalAuthor:UserNode) " +
                                "WITH p, original, COLLECT(DISTINCT author.userId) AS authors, COLLECT(DISTINCT originalAuthor.userId) AS originalAuthors " +
                                "ORDER BY p.createdAt DESC " +
                                "SKIP $skip " +
                                "LIMIT $limit " +
                                "RETURN p { " +
                                "  .*, " +
                                "  originalPost: CASE " +
                                "    WHEN original IS NOT NULL " +
                                "    THEN original { " +
                                "      .*, " +
                                "      createdAt: original.createdAt, " +
                                "      postId: original.postId, " +
                                "      updatedAt: original.updatedAt, " +
                                "      authors: originalAuthors " +
                                "    } " +
                                "    ELSE NULL " +
                                "  END, " +
                                "  authors: authors " +
                                "} AS post "
                )
                .bindAll(Map.of("userId", userId, "skip", skip, "limit", limit)).fetch().all();

        List<PostDTO> postDTOS = new ArrayList<>();
        results.forEach(result -> {
            Map<String, Object> properties = (Map<String, Object>) result.get("post");
            postDTOS.add(new PostDTO(
                    PostDTO.convertFromObject(properties)
            ));
        });
        return postDTOS;
    }
}
