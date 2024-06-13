package vn.edu.iuh.fit.notificationservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.notificationservice.client.UserClient;
import vn.edu.iuh.fit.notificationservice.dto.ConversationDTO;
import vn.edu.iuh.fit.notificationservice.dto.MessageDetailDTO;
import vn.edu.iuh.fit.notificationservice.dto.MessageNotificationRequest;
import vn.edu.iuh.fit.notificationservice.dto.UserDetail;

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

    @PostMapping("/notify/message")
    public void notifyMessage(@RequestBody MessageNotificationRequest request) {
        Set<Long> userIds = new HashSet<>();
        userIds.add(request.message().senderId());
        if (request.message().targetUserId() != null) {
            userIds.addAll(request.message().targetUserId());
        }
        userIds.addAll(request.conversation().getReadBy().keySet());
        if (request.message().reactions() != null) {
            request.message().reactions().values().forEach(userIds::addAll);
        }
        if (request.conversation().getReadBy() != null) {
            userIds.addAll(request.conversation().getReadBy().keySet());
        }

        Map<Long, UserDetail> userDetails = userClient.getUsersByIdsMap(new ArrayList<>(userIds));
        UserDetail senderUserDetail = userDetails.get(request.message().senderId());
        List<UserDetail> targetUserDetail = UserDetail.getUserDetailsFromMap(request.message(), userDetails);
        Map<Long, UserDetail> readByUserDetail = UserDetail.getReadByUserDetailMap(request.conversation().getReadBy(), userDetails);
        for (Long memberId : request.conversation().getMembers()) {
            simpMessagingTemplate.convertAndSendToUser(memberId.toString(), "/message", new MessageDetailDTO(request.message(), senderUserDetail, targetUserDetail, readByUserDetail));
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

    @PostMapping("/notify/read")
    public void notifyRead(@RequestHeader("sub") Long id, @RequestBody MessageNotificationRequest request) {
        Set<Long> userIds = new HashSet<>();
        userIds.add(request.message().senderId());
        if (request.message().targetUserId() != null) {
            userIds.addAll(request.message().targetUserId());
        }
        userIds.addAll(request.conversation().getReadBy().keySet());
        if (request.message().reactions() != null) {
            request.message().reactions().values().forEach(userIds::addAll);
        }
        if (request.conversation().getReadBy() != null) {
            userIds.addAll(request.conversation().getReadBy().keySet());
        }

        Map<Long, UserDetail> userDetails = userClient.getUsersByIdsMap(new ArrayList<>(userIds));
        UserDetail senderUserDetail = userDetails.get(request.message().senderId());
        List<UserDetail> targetUserDetail = UserDetail.getUserDetailsFromMap(request.message(), userDetails);
        Map<Long, UserDetail> readByUserDetail = UserDetail.getReadByUserDetailMap(request.conversation().getReadBy(), userDetails);

        for (Long memberId : request.conversation().getMembers()) {
            simpMessagingTemplate.convertAndSendToUser(memberId.toString(), "/message", new MessageDetailDTO(request.message(), senderUserDetail, targetUserDetail, readByUserDetail));
        }
    }
}
