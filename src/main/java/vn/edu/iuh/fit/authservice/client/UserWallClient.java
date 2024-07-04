package vn.edu.iuh.fit.authservice.client;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import vn.edu.iuh.fit.authservice.dto.RequestCreateUser;

@Service
public class UserWallClient {
    private final WebClient webClient;

    public UserWallClient(WebClient userWallWebClient) {
        this.webClient = userWallWebClient;
    }

    public void createUser(Long id) {
        webClient.post()
                .uri("/user-wall")
                .bodyValue(id)
                .retrieve()
                .bodyToMono(RequestCreateUser.class)
                .subscribe();
    }
}