package vn.edu.iuh.fit.chatservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.chatservice.dto.*;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.service.ConversationService;

import java.util.List;
import java.util.stream.Stream;

@RestController
@RequestMapping("/conversations")
public class ConversationController {
    private final ConversationService conversationService;
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping({"/{conversationId}"})
    public PlainConversationToWebClient getPlainConversation(@RequestHeader("sub") Long id, @PathVariable String conversationId) {
        return new PlainConversationToWebClient(conversationService.getPlainConversation(id, conversationId));
    }

    @GetMapping("/detail/{conversationId}")
    public ResponseEntity<ConversationDTO> getConversation(@RequestHeader("sub") Long id, @PathVariable String conversationId) {
        return ResponseEntity.ok(conversationService.getConversation(id, conversationId));
    }

    @GetMapping("/list")
    public ResponseEntity<List<ConversationDTO>> getConversations(@RequestHeader("sub") Long id) {
        return ResponseEntity.ok(conversationService.findConversationsByUserId(id));
    }

    @PostMapping("/create")
    public ResponseEntity<String> createConversation(@RequestHeader("sub") Long id, @RequestBody CreateConversationRequest request) {
        if (request.members().isEmpty()) {
            return ResponseEntity.badRequest().body("Members is required");
        }

        List<Long> members = getMembersWithId(request.members(), id);

        if (request.type().equals(ConversationType.GROUP)) {
            if (members.size() <= 2) {
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

    @PatchMapping("/{conversationId}/add-member")
    public ResponseEntity<SimpleConversationDTO> addMember(@RequestHeader("sub") Long id,
                                       @PathVariable String conversationId,
                                       @RequestParam(name = "member-id") Long memberId) {
        return ResponseEntity.ok(conversationService.addMember(id, conversationId, memberId));
    }

    @PatchMapping("/{conversationId}/leave")
    public ResponseEntity<String> leaveConversation(@RequestHeader("sub") Long id, @PathVariable String conversationId) {
        Conversation conversation = conversationService.leaveConversation(id, conversationId);
        return ResponseEntity.ok(conversation.getId().toHexString());
    }

    @PatchMapping("/{conversationId}/change-name")
    public ResponseEntity<Conversation> changeName(@RequestHeader("sub") Long id, @PathVariable String conversationId, @RequestParam String name) {
        return ResponseEntity.ok(conversationService.changeName(id, conversationId, name));
    }

    @PatchMapping("/{conversationId}/change-image")
    public ResponseEntity<Conversation> changeImage(@RequestHeader("sub") Long id, @PathVariable String conversationId, @RequestParam String image) {
        return ResponseEntity.ok(conversationService.changeImage(id, conversationId, image));
    }

    @PatchMapping("/{conversationId}/grant-owner")
    public ResponseEntity<Conversation> grantOwner(@RequestHeader("sub") Long adminId,
                                        @PathVariable String conversationId,
                                        @RequestParam(name = "member-id") Long memberId) {
        return ResponseEntity.ok(conversationService.grantOwner(adminId, conversationId, memberId));
    }

    @PatchMapping("/disband/{conversationId}")
    public ResponseEntity<String> disbandConversation(@RequestHeader("sub") Long id, @PathVariable String conversationId) {
        Conversation conversation = conversationService.disbandConversation(id, conversationId);
        return ResponseEntity.ok(conversation.getId().toHexString());
    }

    @PatchMapping("/{conversationId}/kick")
    public ResponseEntity<SimpleConversationDTO> kickMember(@RequestHeader("sub") Long adminId,
                                        @PathVariable String conversationId,
                                        @RequestParam(name = "member-id") Long memberId) {
        return ResponseEntity.ok(conversationService.kickMember(adminId, conversationId, memberId));
    }

    @PatchMapping("/{conversationId}/grant-deputy")
    public ResponseEntity<SimpleConversationDTO> grantDeputy(@RequestHeader("sub") Long adminId,
                                         @PathVariable String conversationId,
                                         @RequestParam(name = "member-id") Long memberId) {
        return ResponseEntity.ok(conversationService.grantDeputy(adminId, conversationId, memberId));
    }

    @PatchMapping("/{conversationId}/revoke-deputy")
    public ResponseEntity<SimpleConversationDTO> revokeDeputy(@RequestHeader("sub") Long adminId,
                                                              @PathVariable String conversationId,
                                                              @RequestParam(name = "member-id") Long memberId) {
        return ResponseEntity.ok(conversationService.revokeDeputy(adminId, conversationId, memberId));
    }

    @PatchMapping("/{conversationId}/update-settings")
    public ResponseEntity<ConversationSettings> updateConversationSettings(@RequestHeader("sub") Long adminId,
                                                                           @PathVariable String conversationId,
                                                                           @RequestBody ConversationSettingsRequest settings) {
        return ResponseEntity.ok(conversationService.updateConversationSettings(adminId, conversationId, settings));
    }

    @GetMapping("/link/{link}")
    public ResponseEntity<ConversationDTO> getConversationByLink(@RequestHeader("sub") Long id, @PathVariable String link) {
        return ResponseEntity.ok(conversationService.findByLink(link));
    }

    @PatchMapping("/join/{link}")
    public ResponseEntity<ConversationDTO> joinByLink(@RequestHeader("sub") Long id, @PathVariable String link) {
        return ResponseEntity.ok(conversationService.joinByLink(id, link));
    }

}
