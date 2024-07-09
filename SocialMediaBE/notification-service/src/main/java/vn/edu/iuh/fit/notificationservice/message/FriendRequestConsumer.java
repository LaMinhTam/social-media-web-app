package vn.edu.iuh.fit.notificationservice.message;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.notificationservice.client.UserClient;
import vn.edu.iuh.fit.notificationservice.dto.FriendRequestDTO;
import vn.edu.iuh.fit.notificationservice.dto.FriendRequestNotification;
import vn.edu.iuh.fit.notificationservice.dto.UserDetail;

import java.util.List;
import java.util.Map;

@Service
public class FriendRequestConsumer {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserClient userClient;

    public FriendRequestConsumer(SimpMessagingTemplate simpMessagingTemplate, UserClient userClient) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.userClient = userClient;
    }

    @RabbitListener(queues = "friend-request-queue")
    public void notifyFriendRequest(FriendRequestDTO request) {
        FriendRequestNotification friendRequestNotification = new FriendRequestNotification(request.id(), request.type());
        String recipient = determineRecipient(request);
        UserDetail userDetail = getUserDetail(recipient);

        friendRequestNotification.setUserId(userDetail.user_id());
        friendRequestNotification.setEmail(userDetail.email());
        friendRequestNotification.setName(userDetail.name());
        friendRequestNotification.setImageUrl(userDetail.image_url());

        simpMessagingTemplate.convertAndSendToUser(
                recipient,
                "/friend-request",
                friendRequestNotification
        );
    }

    private String determineRecipient(FriendRequestDTO request) {
        return switch (request.type()) {
            case "SEND", "REVOKE" -> request.target().toString();
            case "ACCEPT" -> request.source().toString();
            default ->
                // Handle any other cases or default behavior
                    request.target().toString();
        };
    }

    private UserDetail getUserDetail(String recipient) {
        Long userId = Long.parseLong(recipient);
        Map<Long, UserDetail> userDetails = userClient.getUsersByIdsMap(List.of(userId));
        return userDetails.get(userId);
    }
}
