package vn.edu.iuh.fit.notificationservice.message;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.notificationservice.client.UserClient;
import vn.edu.iuh.fit.notificationservice.dto.*;

import java.util.*;

@Service
public class MessageNotificationConsumer {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserClient userClient;

    public MessageNotificationConsumer(SimpMessagingTemplate simpMessagingTemplate, UserClient userClient) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.userClient = userClient;
    }

    @RabbitListener(queues = "message-notification-queue")
    public void notifyMessage(MessageNotificationPayload request) {
        Set<Long> userIds = populateUserIds(request.message(), request.conversation());
        List<Long> notifyMembers = prepareNotifyMembers(request.message(), request.conversation());

        sendMessageToMembers(request, userIds, notifyMembers, request.destination());
    }

    private void sendMessageToMembers(MessageNotificationPayload request, Set<Long> userIds, List<Long> notifyMembers, String destination) {
        Map<Long, UserDetail> userDetails = userClient.getUsersByIdsMap(new ArrayList<>(userIds));
        UserDetail senderUserDetail = userDetails.get(request.message().senderId());
        List<UserDetail> targetUserDetail = UserDetail.getUserDetailsFromMap(request.message(), userDetails);
        Map<Long, UserDetail> readByUserDetail = UserDetail.getReadByUserDetailMap(request.conversation().getReadBy(), userDetails);

        if (request.message().deletedBy() != null) {
            notifyMembers.removeAll(request.message().deletedBy());
        }

        for (Long memberId : notifyMembers) {
            simpMessagingTemplate.convertAndSendToUser(memberId.toString(), "/" + destination,
                    new MessageDetailDTO(request.message(), senderUserDetail, targetUserDetail, readByUserDetail, null));
        }
    }

    private static Set<Long> populateUserIds(Message message, Conversation conversation) {
        Set<Long> userIds = new HashSet<>();
        userIds.add(message.senderId());
        if (message.targetUserId() != null) {
            userIds.addAll(message.targetUserId());
        }
        if (conversation.getReadBy() != null) {
            userIds.addAll(conversation.getReadBy().keySet());
        }
        if (message.reactions() != null) {
            message.reactions().values().forEach(userIds::addAll);
        }
        return userIds;
    }

    private static List<Long> prepareNotifyMembers(Message message, Conversation conversation) {
        List<Long> notifyMembers = conversation.getMembers();
        if (message.deletedBy() != null) {
            notifyMembers.removeAll(message.deletedBy());
        }
        return notifyMembers;
    }

    @RabbitListener(queues = "revoke-reply-notification-queue")
    public void notifyRevokeReplyMessage(MessageNotificationRequest request) {
        Set<Long> userIds = populateUserIds(request.message(), request.conversation());
        List<Long> notifyMembers = prepareNotifyMembers(request.message(), request.conversation());

        Map<Long, UserDetail> userDetails = userClient.getUsersByIdsMap(new ArrayList<>(userIds));
        UserDetail senderUserDetail = userDetails.get(request.message().senderId());
        List<UserDetail> targetUserDetail = UserDetail.getUserDetailsFromMap(request.message(), userDetails);
        Map<Long, UserDetail> readByUserDetail = UserDetail.getReadByUserDetailMap(request.conversation().getReadBy(), userDetails);

        if (request.message().deletedBy() != null) {
            notifyMembers.removeAll(request.message().deletedBy());
        }

        ReplyMessageDTO replyMessage = new ReplyMessageDTO(request.message().replyToMessageId(), "This message has been revoked", null, senderUserDetail.user_id(), request.message().type());

        for (Long memberId : notifyMembers) {
            simpMessagingTemplate.convertAndSendToUser(memberId.toString(), "/revoke",
                    new MessageDetailDTO(request.message(), senderUserDetail, targetUserDetail, readByUserDetail, replyMessage));
        }
    }

    @RabbitListener(queues = "conversation-notification-queue")
    public void notifyConversation(ConversationDTO conversationDTO) {
        List<Long> members = conversationDTO.members().keySet().stream().toList();
        for (Long id : members) {
            simpMessagingTemplate.convertAndSendToUser(id.toString(), "/conversation", conversationDTO);
        }
    }

    @RabbitListener(queues = "read-message-notification-queue")
    public void notifyRead(ReadMessageNotificationPayload request) {
        List<Long> notifyMembers = prepareNotifyMembers(request.message(), request.conversation());

        List<UserDetail> userDetails = userClient.getUsersByIds(List.of(request.id()));

        for (Long memberId : notifyMembers) {
            simpMessagingTemplate.convertAndSendToUser(
                    memberId.toString(),
                    "/read",
                    new ReadMessageResponse(
                            request.message().id(),
                            request.conversation().getId(),
                            userDetails.get(0)
                    )
            );
        }
    }

}
