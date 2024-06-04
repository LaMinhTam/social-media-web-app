package vn.edu.iuh.fit.authservice.client;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import vn.edu.iuh.fit.authservice.dto.RequestCreateUser;
import vn.edu.iuh.fit.authservice.model.User;
import vn.edu.iuh.fit.authservice.security.oauth2.user.OAuth2UserInfo;

@Service
public class UserClient {
    private final WebClient webClient;

    public UserClient(WebClient userWebClient) {
        this.webClient = userWebClient;
    }

    public void createUser(User user, OAuth2UserInfo oAuth2UserInfo) {
        RequestCreateUser requestCreateUser = new RequestCreateUser(
                user.getId(),
                oAuth2UserInfo.getName(),
                oAuth2UserInfo.getEmail(),
                oAuth2UserInfo.getImageUrl()
        );

        webClient.post()
                .uri("/user/create-user")
                .bodyValue(requestCreateUser)
                .retrieve()
                .bodyToMono(RequestCreateUser.class)
                .block();
    }
}