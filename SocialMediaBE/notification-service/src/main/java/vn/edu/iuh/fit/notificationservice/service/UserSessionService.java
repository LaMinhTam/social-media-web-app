package vn.edu.iuh.fit.notificationservice.service;

import vn.edu.iuh.fit.notificationservice.dto.UserStatus;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserSessionService {
    //    Map<Key, Object> map for store session user status, with key is session id, and user status have 2 field (online/offline) and timestamp
    //    Map<Key, Set<String>> map for store user session, with key is user id, and value is list of session id
    void addUserSession(String userId, String sessionId);

    void removeUserSession(String sessionId);

    Optional<String> getSessionIdsByUser(String userId);

    UserStatus getUserStatusBySession(String sessionId);

    Map<Long, UserStatus> getUserStatuses(List<String> sessionIds);

    void onlineNotification(String userId);

    void offlineNotification(String userId);
}
