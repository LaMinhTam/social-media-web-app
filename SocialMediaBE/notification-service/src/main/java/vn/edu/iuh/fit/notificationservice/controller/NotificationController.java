package vn.edu.iuh.fit.notificationservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.notificationservice.client.UserClient;
import vn.edu.iuh.fit.notificationservice.dto.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    Logger loggerFactory = LoggerFactory.getLogger(NotificationController.class);
    private final UserClient userClient;

    public NotificationController(SimpMessagingTemplate simpMessagingTemplate, UserClient userClient) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.userClient = userClient;
    }

    @PostMapping("/notify/{destination}")
    public void notifyMessage(@PathVariable String destination, @RequestBody MessageNotificationRequest request) {
        Set<Long> userIds = populateUserIds(request);
        List<Long> notifyMembers = prepareNotifyMembers(request);

        sendMessageToMembers(request, userIds, notifyMembers, destination);
    }

    private void sendMessageToMembers(MessageNotificationRequest request, Set<Long> userIds, List<Long> notifyMembers, String destination) {
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

    private static Set<Long> populateUserIds(MessageNotificationRequest request) {
        Set<Long> userIds = new HashSet<>();
        userIds.add(request.message().senderId());
        if (request.message().targetUserId() != null) {
            userIds.addAll(request.message().targetUserId());
        }
        if (request.conversation().getReadBy() != null) {
            userIds.addAll(request.conversation().getReadBy().keySet());
        }
        if (request.message().reactions() != null) {
            request.message().reactions().values().forEach(userIds::addAll);
        }
        return userIds;
    }

    private static List<Long> prepareNotifyMembers(MessageNotificationRequest request) {
        List<Long> notifyMembers = request.conversation().getMembers();
        if (request.message().deletedBy() != null) {
            notifyMembers.removeAll(request.message().deletedBy());
        }
        return notifyMembers;
    }

    @PostMapping("/notify/revoke-reply")
    public void notifyRevokeReplyMessage(@RequestBody MessageNotificationRequest request) {
        Set<Long> userIds = populateUserIds(request);
        List<Long> notifyMembers = prepareNotifyMembers(request);

        Map<Long, UserDetail> userDetails = userClient.getUsersByIdsMap(new ArrayList<>(userIds));
        UserDetail senderUserDetail = userDetails.get(request.message().senderId());
        List<UserDetail> targetUserDetail = UserDetail.getUserDetailsFromMap(request.message(), userDetails);
        Map<Long, UserDetail> readByUserDetail = UserDetail.getReadByUserDetailMap(request.conversation().getReadBy(), userDetails);

        if (request.message().deletedBy() != null) {
            notifyMembers.removeAll(request.message().deletedBy());
        }

        ReplyMessageDTO replyMessage = new ReplyMessageDTO(request.message().replyToMessageId(), "This message has been revoked", null, senderUserDetail.user_id());

        for (Long memberId : notifyMembers) {
            simpMessagingTemplate.convertAndSendToUser(memberId.toString(), "/revoke",
                    new MessageDetailDTO(request.message(), senderUserDetail, targetUserDetail, readByUserDetail, replyMessage));
        }
    }

    @PostMapping("/notify/conversation")
    public void notifyConversation(@RequestBody ConversationDTO conversationDTO) {
        List<Long> members = conversationDTO.members().stream()
                .map(UserDetail::user_id)
                .toList();
        for (Long id : members) {
            simpMessagingTemplate.convertAndSendToUser(id.toString(), "/conversation", conversationDTO);
        }
    }

}
