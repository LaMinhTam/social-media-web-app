package vn.edu.iuh.fit.chatservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.chatservice.dto.ConversationDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageDTO;
import vn.edu.iuh.fit.chatservice.dto.ReactRequest;
import vn.edu.iuh.fit.chatservice.dto.ShareMessageRequest;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.service.ConversationService;
import vn.edu.iuh.fit.chatservice.service.MessageService;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/messages")
public class MessageController {
    private final MessageService messageService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ConversationService conversationService;

    public MessageController(MessageService messageService, SimpMessagingTemplate simpMessagingTemplate, ConversationService conversationService) {
        this.messageService = messageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.conversationService = conversationService;
    }

    @RequestMapping("/{conversationId}")
    public ResponseEntity<Map<String, MessageDTO>> getMessagesByConversationId(@PathVariable String conversationId, @RequestParam int page, @RequestParam int size) {
        List<MessageDTO> messages = messageService.getMessagesByConversationId(conversationId, page, size);

        Map<String, MessageDTO> messageMap = messages.stream()
                .collect(Collectors.toMap(MessageDTO::messageId, Function.identity(), (oldValue, newValue) -> oldValue, LinkedHashMap::new));
        return ResponseEntity.ok(messageMap);
    }

    @PostMapping("/share")
    public ResponseEntity<?> shareMessage(@RequestHeader("sub") Long id, @RequestBody ShareMessageRequest request) {
        List<MessageDTO> message = messageService.shareMessage(id, request.messageId(), request.conversationIds());
        for (MessageDTO sharedMessage : message) {
            Conversation conversation = conversationService.getPlainConversation(id, sharedMessage.conversationId());
            conversation.getMembers().forEach(member -> sendMessageToUser(member.toString(), "message", sharedMessage));
        }
        return ResponseEntity.ok(message);
    }

    @PatchMapping("/revoke/{messageId}")
    public ResponseEntity<?> revokeMessage(@RequestHeader("sub") Long id, @PathVariable String messageId) {
        MessageDTO message = messageService.revokeMessage(messageId);
        Conversation conversation = conversationService.getPlainConversation(id, message.conversationId());
        conversation.getMembers().forEach(member -> sendMessageToUser(member.toString(), "revoke", message));
        return ResponseEntity.ok(message);
    }

    @PostMapping("/react")
    public ResponseEntity<?> reactMessage(@RequestHeader("sub") Long id, @RequestBody ReactRequest request) {
        MessageDTO message = messageService.reactMessage(id, request.messageId(), request.reaction());
        Conversation conversation = conversationService.getPlainConversation(id, message.conversationId());
        conversation.getMembers().forEach(member -> sendMessageToUser(member.toString(), "react", message));
        return ResponseEntity.ok(message);
    }

    public void sendMessageToUser(String userId, String destination, Object error) {
        simpMessagingTemplate.convertAndSendToUser(userId, "/" + destination, error);
    }
}
