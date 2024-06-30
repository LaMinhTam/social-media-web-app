package vn.edu.iuh.fit.apigateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private Key key;
    private final RedisTemplate<String, Object> redisTemplate;

    public JwtUtil(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public Claims getAllClaimsFromToken(String token) throws JwtException {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token.substring(7)).getBody();
    }

    private boolean isTokenExpired(String token) {
        try {
            return this.getAllClaimsFromToken(token).getExpiration().before(new Date());
        } catch (ExpiredJwtException ex) {
            return true; // Token is expired
        } catch (JwtException ex) {
            return true; // Other JWT exception occurred
        }
    }

    public boolean isInValid(String token) {
        return this.isTokenExpired(token) || Boolean.TRUE.equals(redisTemplate.hasKey(token.substring(7)));
    }

    public boolean isRefreshToken(String token) {
        return this.getAllClaimsFromToken(token).get("type").equals("REFRESH");
    }
}