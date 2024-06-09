package vn.edu.iuh.fit.chatservice.config.websocket;

import vn.edu.iuh.fit.chatservice.dto.OnlineStatus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserSessionManager {
    private static UserSessionManager instance;
    //    key: sessionId, value: userId
    private final Map<String, String> sessionToUserMap;
    //    key: userId, value: list of sessionId
    private final Map<String, List<String>> userToSessionMap;

    private UserSessionManager() {
        sessionToUserMap = new HashMap<>();
        userToSessionMap = new HashMap<>();
    }

    public static synchronized UserSessionManager getInstance() {
        if (instance == null) {
            instance = new UserSessionManager();
        }
        return instance;
    }

    public void addUserSession(String sessionId, String userId) {
        sessionToUserMap.put(sessionId, userId);
        userToSessionMap.computeIfAbsent(userId, k -> new ArrayList<>());
        userToSessionMap.get(userId).add(sessionId);
    }

    public void removeUserSession(String sessionId) {
        String userId = sessionToUserMap.remove(sessionId);
        if (userId != null) {
            if (userToSessionMap.get(userId).size() == 1) {
                userToSessionMap.remove(userId);
            } else {
                userToSessionMap.get(userId).remove(sessionId);
            }
        }
    }

    public String getUserIdBySession(String sessionId) {
        return sessionToUserMap.get(sessionId);
    }

    public String getSessionIdByUser(String userId) {
        return userToSessionMap.get(userId).stream().findFirst().orElse(null);
    }

    public boolean isUserOnline(String userId) {
        return userToSessionMap.containsKey(userId);
    }

    public Map<Long, OnlineStatus> isUsersOnline(List<Long> userIds) {
        Map<Long, OnlineStatus> result = new HashMap<>();
        userIds.forEach(userId ->
                result.put(
                        userId,
                        userToSessionMap.containsKey(userId.toString()) ? OnlineStatus.ONLINE : OnlineStatus.OFFLINE
                )
        );
        return result;
    }
}
