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
                        """
                                MATCH (currentUser:UserNode {userId: $userId})
                                                                
                                // Match posts authored by any user
                                MATCH (u:UserNode)-[:AUTHORED_BY]->(p:PostNode)
                                                                
                                // Determine if the post is authored by a user whom the current user follows
                                OPTIONAL MATCH (currentUser)-[:FOLLOW]->(following:UserNode)-[:AUTHORED_BY]->(p)
                                WITH p, u, following
                                                                
                                // Match details about the post, reactions, shared posts, and authors
                                OPTIONAL MATCH (p)<-[:REACTION]-(r:ReactionNode)
                                OPTIONAL MATCH (p)-[:SHARE_OF]->(original:PostNode)
                                OPTIONAL MATCH (p)<-[:AUTHORED_BY]-(author:UserNode)
                                OPTIONAL MATCH (original)<-[:AUTHORED_BY]-(originalAuthor:UserNode)
                                                                
                                WITH p, u.userId AS userId, COUNT(r) AS reactionCount,\s
                                     COLLECT(DISTINCT author.userId) AS authors,\s
                                     original,\s
                                     COLLECT(DISTINCT originalAuthor.userId) AS originalAuthors,
                                     CASE WHEN following IS NOT NULL THEN true ELSE false END AS isFollowed,
                                     duration.inDays(datetime(p.createdAt), datetime()).days AS daysSinceCreation
                                                                
                                WITH p, userId, reactionCount, authors, original, originalAuthors, isFollowed, daysSinceCreation,
                                     CASE
                                       WHEN reactionCount > 0 THEN 1.0 * reactionCount
                                       ELSE 0
                                     END AS baseScore,
                                     CASE
                                       WHEN daysSinceCreation <= 7 THEN 1.5
                                       WHEN daysSinceCreation <= 14 THEN 1.2
                                       WHEN daysSinceCreation <= 21 THEN 1.0
                                       ELSE 0.8
                                     END AS recencyMultiplier
                                                                
                                // Adjust the score based on whether the post is from a followed user
                                WITH p, userId, reactionCount, authors, original, originalAuthors, isFollowed, daysSinceCreation,\s
                                     baseScore, recencyMultiplier,
                                     (baseScore * recencyMultiplier - (daysSinceCreation / 7) * 1.0) AS baseFinalScore,
                                     CASE WHEN isFollowed THEN (baseScore * recencyMultiplier * 2.0 - (daysSinceCreation / 7) * 1.0)
                                          ELSE (baseScore * recencyMultiplier - (daysSinceCreation / 7) * 1.0)
                                     END AS finalScore
                                                                
                                ORDER BY finalScore DESC
                                                                
                                SKIP $skip
                                LIMIT $limit
                                                                
                                RETURN COLLECT(DISTINCT p {
                                  .*,\s
                                  authors: authors,
                                  originalPost: CASE\s
                                    WHEN original IS NOT NULL\s
                                    THEN original {
                                      .*,\s
                                      authors: originalAuthors,
                                      createdAt: original.createdAt,\s
                                      postId: original.postId,\s
                                      updatedAt: original.updatedAt\s
                                    }\s
                                    ELSE NULL\s
                                  END
                                }) AS posts;
                        """
                ))
                .bindAll(Map.of("userId", userId, "skip", skip, "limit", limit)).fetch().all();
        List<PostDTO> postDTOS = new ArrayList<>();
        results.forEach(result -> {
            List<Map<String, Object>> nodes = (List<Map<String, Object>>) result.get("posts");
            nodes.forEach(properties -> postDTOS.add(new PostDTO(PostDTO.convertFromObject(properties))));
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
