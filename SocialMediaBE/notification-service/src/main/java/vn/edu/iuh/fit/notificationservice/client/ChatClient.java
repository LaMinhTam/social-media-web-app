package vn.edu.iuh.fit.notificationservice.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import vn.edu.iuh.fit.notificationservice.dto.*;

@Service
public class ChatClient {

    private final WebClient webClient;
    Logger log = LoggerFactory.getLogger(ChatClient.class);

    public ChatClient(WebClient chatWebClient) {
        this.webClient = chatWebClient;
    }

    public MessageFromWebClient saveMessage(Long userId, MessageFromClientDTO message) {
        log.info("Sending message to save: {}", message);
        return webClient.post()
                .uri("/messages")
                .header("sub", userId.toString())
                .bodyValue(message)
                .retrieve()
                .bodyToMono(MessageFromWebClient.class)
                .doOnNext(savedMessage -> log.info("Received saved message: {}", savedMessage))
                .doOnError(error -> log.error("Error saving message", error))
                .block();
    }


    public ConversationFromWebClient getPlainConversation(long id, String conversationId) {
        return webClient.get()
                .uri("/conversations/" + conversationId)
                .header("sub", String.valueOf(id))
                .retrieve()
                .bodyToMono(ConversationFromWebClient.class)
                .block();
    }

    public ReplyMessageDTO getPlainMessage(long id, String s) {
        return webClient.get()
                .uri("/messages/plain/" + s)
                .header("sub", String.valueOf(id))
                .retrieve()
                .bodyToMono(ReplyMessageDTO.class)
                .block();
    }
}
