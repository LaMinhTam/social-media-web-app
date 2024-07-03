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
                        .uri("https://auth-service-xssb.onrender.com"))
                .route("user-service", r -> r.path("/friends/**", "/user/**")
                        .filters(f -> f.filter(filter))
                        .uri("https://user-service-hz6u.onrender.com"))
                .route("notification-service", r -> r.path("/websocket/**")
                        .filters(f -> f.rewritePath("/websocket/(?<remains>.*)", "/${remains}")
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE")
                        )
                        .uri("http://34.227.22.174/"))
                .route("notification-service", r -> r.path("/user-status/**")
                        .filters(f -> f.filter(filter))
                        .uri("http://34.227.22.174"))
                .route("chat-service", r -> r.path("/conversations/**", "/messages/**")
                        .filters(f -> f.filter(filter))
                        .uri("https://chat-service-lmve.onrender.com"))
                .route("post-service", r -> r.path("/posts/**", "/comments/**", "/reactions/**", "/user-wall/**")
                        .filters(f -> f.filter(filter))
                        .uri("https://post-service-cqfq.onrender.com"))
                .build();
    }


}

