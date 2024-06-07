package vn.edu.iuh.fit.chatservice.controller;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import vn.edu.iuh.fit.chatservice.dto.MessageErrorDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageFromClientDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageResponse;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.service.MessageService;

import java.util.Date;
import java.util.Map;

@Controller
public class WebSocketController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;

    public WebSocketController(SimpMessagingTemplate simpMessagingTemplate, MessageService messageService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/message")
    public void processMessageFromClient(SimpMessageHeaderAccessor sha, @Payload MessageFromClientDTO message) {
        String userId = sha.getNativeHeader("sub").get(0);
        Message savedMessage = null;
        try {
            savedMessage = messageService.saveMessage(Long.parseLong(userId), message);
            MessageResponse response = new MessageResponse(savedMessage);
            sendMessageToUser(userId, "message", response);
        } catch (Exception e) {
            MessageErrorDTO error = new MessageErrorDTO(
                    null,
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

    private void sendMessageToUser(String userId, String destination, Object error) {
        simpMessagingTemplate.convertAndSendToUser(userId, "/" + destination, error);
    }


}
