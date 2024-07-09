package vn.edu.iuh.fit.userservice.message;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.userservice.dto.FriendRequestDTO;

@Service
public class FriendRequestNotificationProducer {
    private final RabbitTemplate rabbitTemplate;

    public FriendRequestNotificationProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendFriendRequestNotification(FriendRequestDTO friendRequestDTO) {
        rabbitTemplate.convertAndSend("friend-request-exchange", "friend-request", friendRequestDTO);
    }
}
