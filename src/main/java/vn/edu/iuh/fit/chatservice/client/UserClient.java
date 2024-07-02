package vn.edu.iuh.fit.chatservice.client;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import vn.edu.iuh.fit.chatservice.model.UserDetail;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserClient {
    private final WebClient webClient;

    public UserClient(WebClient userWebClient) {
        this.webClient = userWebClient;
    }

    public List<UserDetail> getUsersByIds(Collection<Long> ids) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/user")
                        .queryParam("ids", ids.stream().map(String::valueOf).collect(Collectors.joining(",")))
                        .build())
                .retrieve()
                .bodyToFlux(UserDetail.class)
                .collectList()
                .block();
    }


    public Map<Long, UserDetail> getUsersByIdsMap(Collection<Long> ids) {
        return getUsersByIds(ids).stream().collect(Collectors.toMap(UserDetail::user_id, Function.identity()));
    }
}