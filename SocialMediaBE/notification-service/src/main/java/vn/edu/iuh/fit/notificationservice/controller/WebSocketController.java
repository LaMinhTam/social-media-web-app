package vn.edu.iuh.fit.notificationservice.controller;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import vn.edu.iuh.fit.notificationservice.client.ChatClient;
import vn.edu.iuh.fit.notificationservice.client.UserClient;
import vn.edu.iuh.fit.notificationservice.dto.*;

import java.util.*;

@Controller
public class WebSocketController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatClient chatClient;
    private final UserClient userClient;

    public WebSocketController(SimpMessagingTemplate simpMessagingTemplate, ChatClient chatClient, UserClient userClient) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.chatClient = chatClient;
        this.userClient = userClient;
    }

    @MessageMapping("/message")
    public void processMessageFromClient(SimpMessageHeaderAccessor sha, @Payload MessageFromClientDTO message) {
        String userId = sha.getNativeHeader("sub").get(0);
        try {
            Message savedMessage = chatClient.saveMessage(Long.parseLong(userId), message);
            Conversation conversation = chatClient.getPlainConversation(Long.parseLong(userId), savedMessage.conversationId());

            List<Long> member = new ArrayList<>();
            member.add(savedMessage.senderId());
            member.addAll(savedMessage.targetUserId());

            Map<Long, UserDetail> userDetails = userClient.getUsersByIdsMap(member);
            UserDetail sender = userDetails.get(savedMessage.senderId());
            List<UserDetail> targetUsers = new ArrayList<>();
            savedMessage.targetUserId().forEach(
                    id -> targetUsers.add(userDetails.get(id))
            );

            MessageDetailDTO response = new MessageDetailDTO(savedMessage, sender, targetUsers, null);
            conversation.getMembers().forEach(
                    memberId -> sendMessageToUser(memberId.toString(), "message", response)
            );
        } catch (Exception e) {
            MessageErrorDTO error = new MessageErrorDTO(
                    Optional.of(message.conversationId()).orElse(null),
                    message.content(),
                    e.getMessage(),
                    new Date());
            sendMessageToUser(userId, "error", error);
        }
    }

    @MessageExceptionHandler
    @SendToUser("/topic/errors")
    public String handleException(@Payload Map<String, Object> msg, SimpMessageHeaderAccessor sha, Throwable exception) {
        String userId = sha.getNativeHeader("sub").get(0);
        if (msg.get("conversation_id") == null || msg.get("message") == null) {
            sendMessageToUser(userId, "error", "unknown error");
        } else {
            MessageErrorDTO error = new MessageErrorDTO(
                    msg.get("conversation_id").toString(),
                    msg.get("message").toString(),
                    exception.getMessage(),
                    new Date());
            sendMessageToUser(userId, "error", error);
        }
        return exception.getMessage();
    }

    public void sendMessageToUser(String userId, String destination, Object error) {
        simpMessagingTemplate.convertAndSendToUser(userId, "/" + destination, error);
    }
}
