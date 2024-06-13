package vn.edu.iuh.fit.chatservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cloud.client.loadbalancer.reactive.LoadBalancedExchangeFilterFunction;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.codec.ClientCodecConfigurer;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    private final LoadBalancedExchangeFilterFunction filterFunction;

    public WebClientConfig(LoadBalancedExchangeFilterFunction filterFunction) {
        this.filterFunction = filterFunction;
    }


    @Bean
    public WebClient userWebClient() {
        return WebClient.builder()
                .baseUrl("http://user-service")
                .filter(filterFunction)
                .build();
    }

    @Bean
    public WebClient notificationWebClient(ObjectMapper objectMapper) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(clientCodecConfigurer -> {
                    ClientCodecConfigurer.ClientDefaultCodecs codecs = clientCodecConfigurer.defaultCodecs();
                    codecs.jackson2JsonEncoder(new Jackson2JsonEncoder(objectMapper));
                    codecs.jackson2JsonDecoder(new Jackson2JsonDecoder(objectMapper));
                })
                .build();

        return WebClient.builder()
                .baseUrl("http://notification-service")
                .exchangeStrategies(strategies)
                .filter(filterFunction)
                .build();
    }
}