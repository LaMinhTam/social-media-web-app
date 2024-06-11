package vn.edu.iuh.fit.chatservice.service.impl;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.chatservice.dto.OnlineStatus;
import vn.edu.iuh.fit.chatservice.model.UserStatus;
import vn.edu.iuh.fit.chatservice.service.UserSessionService;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class UserSessionServiceImpl implements UserSessionService {
    private final RedisTemplate<String, Object> redisTemplate;

    public UserSessionServiceImpl(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

//    opsForValue Map<Key, Object>
//    Map<Key, Object> map for store session user status, with key is session id, and user status have 2 field (online/offline) and timestamp
//    opsForSet Map<Key, Set<String>>
//    Map<Key, Set<String>> map for store user session, with key is user id, and value is list of session id
    @Override
    public void addUserSession(String userId, String sessionId) {
        UserStatus userStatus = new UserStatus(userId, OnlineStatus.ONLINE, System.currentTimeMillis());

        Optional<Object> existSessionId = redisTemplate.opsForSet().members(userId).stream().findFirst();
        if (existSessionId.isPresent()) {
            UserStatus existStatus = (UserStatus) redisTemplate.opsForValue().get(existSessionId.get().toString());
            if (existStatus != null && existStatus.online().equals(OnlineStatus.OFFLINE)) {
                //remove the offline and add new online
                redisTemplate.delete(existStatus.userId());
                redisTemplate.delete(existSessionId.get().toString());
            }
        }

        redisTemplate.opsForValue().set(sessionId, userStatus);
        redisTemplate.opsForSet().add(userId, sessionId);
    }

    @Override
    public void removeUserSession(String sessionId) {
        // Retrieve the user ID associated with the session ID
        UserStatus userStatus = (UserStatus) redisTemplate.opsForValue().get(sessionId);
        if (redisTemplate.opsForSet().size(userStatus.userId()) == 1) {
            redisTemplate.opsForValue().set(sessionId, new UserStatus(userStatus.userId(), OnlineStatus.OFFLINE, new Date().getTime()), 7, TimeUnit.DAYS);
        } else {
            // Remove session ID from the user's set of sessions
            Set<Object> sessionIds = redisTemplate.opsForSet().members(userStatus.userId());
            if(sessionIds.size() == 1) {
                redisTemplate.delete(userStatus.userId());
            }else{
                redisTemplate.opsForSet().remove(userStatus.userId(), sessionId);
            }
            // Remove the user status associated with the session ID
            redisTemplate.delete(sessionId);
        }
    }

    @Override
    public Optional<String> getSessionIdsByUser(String userId) {
        // Retrieve the set of session IDs for the user
        Set<Object> sessionIds = redisTemplate.opsForSet().members(userId);
        return sessionIds.stream().map(Object::toString).findFirst();
    }

    @Override
    public UserStatus getUserStatusBySession(String sessionId) {
        return (UserStatus) redisTemplate.opsForValue().get(sessionId);
    }

    @Override
    public Map<Long, UserStatus> getUserStatuses(List<String> userIds) {
        Map<Long, UserStatus> userStatuses = userIds.stream()
                .map(userId -> redisTemplate.opsForSet().members(userId))
                .flatMap(Collection::stream)
                .map(sessionId -> (UserStatus) redisTemplate.opsForValue().get(sessionId))
                .collect(Collectors.toMap(
                        userStatus -> Long.parseLong(userStatus.userId()),
                        userStatus -> userStatus,
                        (existingValue, newValue) -> newValue // This is the merge function
                ));

        // For each userId that doesn't have a corresponding entry in the map, add a new UserStatus object
        for (String userId : userIds) {
            Long userIdLong = Long.parseLong(userId);
            userStatuses.putIfAbsent(userIdLong, new UserStatus(userIdLong.toString(), OnlineStatus.OFFLINE, 0));
        }

        return userStatuses;
    }
}
