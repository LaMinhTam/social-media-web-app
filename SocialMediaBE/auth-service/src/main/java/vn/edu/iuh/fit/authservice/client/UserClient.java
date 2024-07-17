package vn.edu.iuh.fit.authservice.client;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import vn.edu.iuh.fit.authservice.dto.RequestCreateUser;

@Service
public class UserClient {
    private final WebClient webClient;

    public UserClient(WebClient userWebClient) {
        this.webClient = userWebClient;
    }

    public void createUser(RequestCreateUser requestCreateUser) {
        webClient.post()
                .uri("/user/create-user")
                .bodyValue(requestCreateUser)
                .retrieve()
                .bodyToMono(RequestCreateUser.class)
                .block();
    }
}