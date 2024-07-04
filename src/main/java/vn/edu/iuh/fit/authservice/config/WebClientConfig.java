package vn.edu.iuh.fit.authservice.config;

import org.springframework.cloud.client.loadbalancer.reactive.LoadBalancedExchangeFilterFunction;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Bean
    public WebClient userWebClient() {
        return WebClient.builder()
                .baseUrl("https://user-service-hz6u.onrender.com")
                .build();
    }

    @Bean
    public WebClient userWallWebClient() {
        return WebClient.builder()
                .baseUrl("https://post-service-cqfq.onrender.com")
                .build();
    }
}