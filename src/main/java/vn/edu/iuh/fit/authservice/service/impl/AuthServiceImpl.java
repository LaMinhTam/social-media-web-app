package vn.edu.iuh.fit.authservice.service.impl;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.authservice.service.AuthService;

import java.util.concurrent.TimeUnit;

@Service
public class AuthServiceImpl implements AuthService {
    private final RedisTemplate<String, Object> redisTemplate;

    public AuthServiceImpl(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setTokenToBlackList(String token, Long sub) {
        redisTemplate.opsForValue().set(token, sub, 10, TimeUnit.MINUTES);
    }

}
