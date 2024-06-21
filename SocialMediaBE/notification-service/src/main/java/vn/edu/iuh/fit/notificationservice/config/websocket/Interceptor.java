package vn.edu.iuh.fit.notificationservice.config.websocket;

import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import vn.edu.iuh.fit.notificationservice.service.UserSessionService;
import vn.edu.iuh.fit.notificationservice.util.JwtUtil;

@Component
//@GlobalChannelInterceptor
public class Interceptor implements ChannelInterceptor {
    private final JwtUtil jwtUtil;
    private final Logger log = LoggerFactory.getLogger(Interceptor.class);
    private final UserSessionService userSessionService;

    public Interceptor(JwtUtil jwtUtil, UserSessionService userSessionService) {
        this.jwtUtil = jwtUtil;
        this.userSessionService = userSessionService;
    }

    @Override
    public Message<?> preSend(Message<?> msg, MessageChannel mc) {
        StompHeaderAccessor headerAccessor = MessageHeaderAccessor.getAccessor(msg, StompHeaderAccessor.class);
//        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(msg);
        StompCommand command = headerAccessor.getCommand();
        try {
            if (StompCommand.CONNECT.equals(command)) {
                String userId = extractUserIdAndSetInHeader(headerAccessor);
                Thread thread = new Thread(() -> {
                    userSessionService.addUserSession(userId, headerAccessor.getSessionId());
                    userSessionService.onlineNotification(userId);
                });
                thread.start();
            }
            if(StompCommand.SUBSCRIBE.equals(command)){
//                String userIdFromJwt = extractUserIdAndSetInHeader(headerAccessor);
//                String subscribeUserId = msg.getHeaders().get("simpDestination").toString().split("/")[2];
//                if(!userIdFromJwt.equals(subscribeUserId)){
//                    throw new RuntimeException("Unauthorized");
//                }
            }
            if (StompCommand.SEND.equals(command)) {
//            return MessageBuilder.createMessage(msg.getPayload(), headerAccessor.getMessageHeaders());
            }
            if (StompCommand.DISCONNECT.equals(command)) {
                Thread thread = new Thread(() -> {
                    String userId = userSessionService.getUserIdBySessionId(headerAccessor.getSessionId());
                    userSessionService.removeUserSession(headerAccessor.getSessionId());
                    userSessionService.onlineNotification(userId);
                });
                thread.start();
            }
        } catch (NullPointerException e) {
            throw new RuntimeException(e.getMessage());
        }
        return msg;
    }

    private String extractUserIdAndSetInHeader(StompHeaderAccessor headerAccessor) {
        String token = headerAccessor.getNativeHeader("Authorization").get(0);
        Claims claims = jwtUtil.getAllClaimsFromToken(token);
        String userId = claims.getSubject();
        headerAccessor.addNativeHeader("sub", userId);
        return userId;
    }

    @Override
    public void postSend(Message<?> msg, MessageChannel mc, boolean bln) {
        log.info("In postSend");
    }

    @Override
    public void afterSendCompletion(Message<?> msg, MessageChannel mc, boolean bln, Exception excptn) {
        log.info("In afterSendCompletion");
    }

    @Override
    public boolean preReceive(MessageChannel mc) {
        log.info("In preReceive");
        return true;
    }
}