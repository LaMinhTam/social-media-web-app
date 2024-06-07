package vn.edu.iuh.fit.chatservice.config;

import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
//@GlobalChannelInterceptor
public class Interceptor implements ChannelInterceptor {
    private final JwtUtil jwtUtil;
    private final Logger log = LoggerFactory.getLogger(Interceptor.class);

    public Interceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Message<?> preSend(Message<?> msg, MessageChannel mc) {
        StompHeaderAccessor headerAccessor = MessageHeaderAccessor.getAccessor(msg, StompHeaderAccessor.class);
//        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(msg);
        if (StompCommand.CONNECT.equals(headerAccessor.getCommand())) {
            String token = headerAccessor.getNativeHeader("Authorization").get(0);
            Claims claims = jwtUtil.getAllClaimsFromToken(token);
            headerAccessor.addNativeHeader("sub", claims.getSubject());
        }
        if (StompCommand.SEND.equals(headerAccessor.getCommand())) {
            String token = headerAccessor.getNativeHeader("Authorization").get(0);
            Claims claims = jwtUtil.getAllClaimsFromToken(token);
            headerAccessor.addNativeHeader("sub", claims.getSubject());
//            return MessageBuilder.createMessage(msg.getPayload(), headerAccessor.getMessageHeaders());
        }
        return msg;
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