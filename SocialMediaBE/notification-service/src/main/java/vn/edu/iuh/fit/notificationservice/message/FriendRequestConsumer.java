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
        switch (request.type()) {
            case "SEND":
                Map<Long, UserDetail> userDetails = userClient.getUsersByIdsMap(List.of(request.target()));
                UserDetail senderUserDetail = userDetails.get(request.source());
                friendRequestNotification.setUserId(senderUserDetail.user_id());
                friendRequestNotification.setEmail(senderUserDetail.email());
                friendRequestNotification.setName(senderUserDetail.name());
                friendRequestNotification.setImageUrl(senderUserDetail.image_url());
                break;
            case "REVOKE":
                break;
            case "ACCEPT":
                break;
            default:
                break;
        }
        simpMessagingTemplate.convertAndSendToUser(
                request.target().toString(),
                "/friend-request",
                friendRequestNotification
        );
    }
}
