package vn.edu.iuh.fit.chatservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.chatservice.client.UserClient;
import vn.edu.iuh.fit.chatservice.dto.ConversationDTO;
import vn.edu.iuh.fit.chatservice.dto.CreateConversationRequest;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.model.UserDetail;
import vn.edu.iuh.fit.chatservice.service.ConversationService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/conversations")
public class ConversationController {
    private final ConversationService conversationService;
    private final UserClient userClient;

    public ConversationController(ConversationService conversationService, UserClient userClient) {
        this.conversationService = conversationService;
        this.userClient = userClient;
    }

    private ConversationDTO createConversationDTO(Conversation conversation, Map<Long, UserDetail> userModels, Long id) {
        ConversationDTO conversationDTO = ConversationDTO.builder()
                .conversationId(conversation.getId().toHexString())
                .members(conversation.getMembers().stream().map(userModels::get).toList())
                .type(conversation.getType())
                .build();
        if (conversation.getType().equals(ConversationType.PRIVATE)) {
            Optional<Long> remainingMember = conversation.getMembers().stream()
                    .filter(memberId -> !memberId.equals(id))
                    .findFirst();
            if (remainingMember.isPresent() && userModels.get(remainingMember.get()) != null) {
                conversationDTO.setName(userModels.get(remainingMember.get()).name());
                conversationDTO.setImage(userModels.get(remainingMember.get()).image_url());
            }
        } else {
            conversationDTO.setName(conversation.getName());
            conversationDTO.setImage(conversation.getAvatar());
        }
        return conversationDTO;
    }

    @GetMapping("/detail/{conversationId}")
    public ResponseEntity<?> getConversation(@RequestHeader("sub") Long id, @PathVariable String conversationId) {
        Conversation conversation = conversationService.getConversation(id, conversationId);
        List<Long> memberIds = conversation.getMembers().stream().distinct().toList();
        Map<Long, UserDetail> userModels = userClient.getUsersByIds(memberIds).stream().collect(Collectors.toMap(UserDetail::user_id, u -> u));
        ConversationDTO conversationDTO = createConversationDTO(conversation, userModels, id);
        return ResponseEntity.ok(conversationDTO);
    }

    @GetMapping("/list")
    public ResponseEntity<List<ConversationDTO>> getConversations(@RequestHeader("sub") Long id) {
        List<Conversation> conversations = conversationService.findConversationsByUserId(id);
        List<Long> memberIds = conversations.stream()
                .flatMap(conversation -> conversation.getMembers().stream())
                .distinct().toList();
        Map<Long, UserDetail> userModels = userClient.getUsersByIds(memberIds).stream().collect(Collectors.toMap(UserDetail::user_id, u -> u));
        List<ConversationDTO> conversationDTOS = conversations.stream()
                .map(conversation -> createConversationDTO(conversation, userModels, id))
                .toList();
        return ResponseEntity.ok(conversationDTOS);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createConversation(@RequestHeader("sub") Long id, @RequestBody CreateConversationRequest request) {
        if (request.members().isEmpty()) {
            return ResponseEntity.badRequest().body("Members is required");
        }

        List<Long> members = getMembersWithId(request.members(), id);

        if (request.type().equals(ConversationType.GROUP)) {
            if (isNullOrEmpty(request.name())) {
                return ResponseEntity.badRequest().body("Name and image is required");
            } else if (members.size() <= 2) {
                return ResponseEntity.badRequest().body("Group conversation must have at least 3 members");
            }
        } else if (request.type().equals(ConversationType.PRIVATE) && members.size() != 2) {
            return ResponseEntity.badRequest().body("Private conversation must have only 2 members");
        }

        String conversationId = conversationService.createConversation(id, request.name(), request.image(), members, ConversationType.valueOf(request.type().name()));
        return ResponseEntity.ok(conversationId);
    }

    private List<Long> getMembersWithId(List<Long> members, Long id) {
        return Stream.concat(members.stream(), Stream.of(id)).distinct().toList();
    }

    private boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    @PatchMapping("/disband/{conversationId}")
    public ResponseEntity<?> disbandConversation(@RequestHeader("sub") Long id, @PathVariable String conversationId) {
        conversationService.disbandConversation(id, conversationId);
        return ResponseEntity.ok().build();
    }

//    @PatchMapping("/{conversationId}/update")
//    public ResponseEntity<String> updateConversation(@PathVariable String conversationId, @RequestHeader("sub") Long id, @RequestBody CreateConversationRequest request) {
//        return ResponseEntity.ok();
//    }
}
