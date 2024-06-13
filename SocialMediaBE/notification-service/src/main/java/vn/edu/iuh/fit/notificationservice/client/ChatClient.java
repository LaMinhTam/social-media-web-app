package vn.edu.iuh.fit.notificationservice.client;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import vn.edu.iuh.fit.notificationservice.dto.Conversation;
import vn.edu.iuh.fit.notificationservice.dto.Message;
import vn.edu.iuh.fit.notificationservice.dto.MessageFromClientDTO;

@Service
public class ChatClient {

    private final WebClient webClient;

    public ChatClient(WebClient chatWebClient) {
        this.webClient = chatWebClient;
    }

    public Message saveMessage(Long id, MessageFromClientDTO message) {
        return webClient.post()
                .uri("/messages")
                .bodyValue(message)
                .retrieve()
                .bodyToMono(Message.class)
                .block();
    }

    public Conversation getPlainConversation(long id, String conversationId) {
        return webClient.get()
                .uri("/conversation/" + conversationId)
                .header("sub", String.valueOf(id))
                .retrieve()
                .bodyToMono(Conversation.class)
                .block();
    }
}
