package vn.edu.iuh.fit.apigateway.security;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/auth/signup",
            "/auth/login",
            "/oauth2/authorize/facebook",
            "/oauth2/authorize/google",
            "/auth/refresh"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));

    public Predicate<ServerHttpRequest> isRefreshToken =
            request -> request.getURI().getPath().contains("/auth/refresh");
}