package vn.edu.iuh.fit.chatservice.client;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import vn.edu.iuh.fit.chatservice.dto.ConversationDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageNotificationRequest;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.model.ConversationModel;
import vn.edu.iuh.fit.chatservice.model.MessageModel;

@Service
public class NotificationClient {
    private final WebClient webClient;

    public NotificationClient(WebClient notificationWebClient) {
        this.webClient = notificationWebClient;
    }

    public void notifyConversationMembers(Conversation conversation, Message message) {
        MessageNotificationRequest request = new MessageNotificationRequest(new ConversationModel(conversation), new MessageModel(message));
        webClient.post()
                .uri("/notifications/notify/message")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(MessageNotificationRequest.class)
                .subscribe();
    }

    public void notifyConversation(ConversationDTO conversation) {
        webClient.post()
                .uri("/notifications/notify/conversation")
                .bodyValue(conversation)
                .retrieve()
                .bodyToMono(ConversationDTO.class)
                .subscribe();
    }

    public void notifyRead(Long userId, Conversation conversation, Message message){
        webClient.post()
                .uri("/notifications/notify/read")
                .bodyValue(new MessageNotificationRequest(new ConversationModel(conversation), new MessageModel(message)))
                .header("sub", String.valueOf(userId))
                .retrieve()
                .bodyToMono(MessageNotificationRequest.class)
                .subscribe();
    }
}
