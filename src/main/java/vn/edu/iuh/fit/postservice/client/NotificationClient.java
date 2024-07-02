package vn.edu.iuh.fit.postservice.client;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class NotificationClient {
    private final WebClient webClient;

    public NotificationClient(WebClient notificationWebClient) {
        this.webClient = notificationWebClient;
    }

}
