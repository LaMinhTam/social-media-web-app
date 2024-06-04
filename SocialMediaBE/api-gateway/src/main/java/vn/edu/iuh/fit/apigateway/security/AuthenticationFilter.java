package vn.edu.iuh.fit.apigateway.security;


import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RefreshScope
@Component
public class AuthenticationFilter implements GatewayFilter {

    @Autowired
    private RouterValidator routerValidator;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        if (routerValidator.isSecured.test(request)) {
            if (this.isAuthMissing(request)) {
                return this.onError(exchange, "Authorization header is missing in request", HttpStatus.UNAUTHORIZED);
            }

            final String token = this.getAuthHeader(request);

            if (jwtUtil.isInValid(token))
                return this.onError(exchange, "Authorization header is invalid or expired", HttpStatus.UNAUTHORIZED);

            this.populateRequestWithHeaders(exchange, token);
        } else if (routerValidator.isRefreshToken.test(request)) {
            final String token = this.getAuthHeader(request);
            if (!jwtUtil.isRefreshToken(token)) {
                return this.onError(exchange, "Invalid token type", HttpStatus.UNAUTHORIZED);
            }
            this.populateRequestWithHeaders(exchange, token);
        }
        return chain.filter(exchange);
    }


    /*PRIVATE*/

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
//        ServerHttpResponse response = exchange.getResponse();
//        response.setStatusCode(httpStatus);
//        return response.setComplete();
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().add("Content-Type", "application/json");

        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("status", httpStatus.value());
        errorBody.put("message", err);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            byte[] errorBodyBytes = objectMapper.writeValueAsBytes(errorBody);
            return response.writeWith(Mono.just(response.bufferFactory().wrap(errorBodyBytes)));
        } catch (IOException e) {
            // Handle JSON serialization error
            return Mono.error(e);
        }

    }

    private String getAuthHeader(ServerHttpRequest request) {
        return request.getHeaders().getOrEmpty("Authorization").get(0);
    }

    private boolean isAuthMissing(ServerHttpRequest request) {
        return !request.getHeaders().containsKey("Authorization");
    }

    private void populateRequestWithHeaders(ServerWebExchange exchange, String token) {
        Claims claims = jwtUtil.getAllClaimsFromToken(token);
        exchange.getRequest().mutate()
                .header("sub", claims.getSubject())
                .header("email", String.valueOf(claims.get("email")))
                .header("role", String.valueOf(claims.get("role")))
                .build();
    }
}
