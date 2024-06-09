package vn.edu.iuh.fit.apigateway.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    @Autowired
    AuthenticationFilter filter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/auth/**", "/oauth2/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://auth-service"))
                .route("user-service", r -> r.path("/friends/**", "/user/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://user-service"))
                .route("chat-service", r -> r.path("/websocket/**")
                        .filters(f -> f.rewritePath("/websocket/(?<remains>.*)", "/${remains}")
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE")
                        )
                        .uri("lb://CHAT-SERVICE/"))
                .route("chat-service", r -> r.path("/conversations/**", "/messages/**","/user-status/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://chat-service"))
                .build();
    }


}

