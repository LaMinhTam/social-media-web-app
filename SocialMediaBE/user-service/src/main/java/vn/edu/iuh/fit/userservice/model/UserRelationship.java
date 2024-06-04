package vn.edu.iuh.fit.userservice.model;

import java.util.Map;

//with key is user id and value is friend relationship id
public record UserRelationship(
        Map<Long, Long> sendRequest,
        Map<Long, Long> receiveRequest,
        Map<Long, Long> blocked,
        Map<Long, Long> friends
) {

}
