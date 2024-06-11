package vn.edu.iuh.fit.chatservice.config.videocall;


import org.kurento.client.KurentoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
import vn.edu.iuh.fit.chatservice.config.videocall.groupcall.CallHandler;
import vn.edu.iuh.fit.chatservice.config.videocall.groupcall.GroupCallUserRegistry;
import vn.edu.iuh.fit.chatservice.config.videocall.groupcall.RoomManager;
import vn.edu.iuh.fit.chatservice.config.videocall.one2One.One2OneCallHandler;
import vn.edu.iuh.fit.chatservice.config.videocall.one2One.One2OneUserRegistry;

@Configuration
@EnableWebSocket
public class VideoCallConfig implements WebSocketConfigurer {
    @Bean
    public GroupCallUserRegistry groupCallRegistry() {
        return new GroupCallUserRegistry();
    }

    @Bean
    public CallHandler groupCallHandler() {
        return new CallHandler();
    }

    @Bean
    public One2OneCallHandler callHandler() {
        return new One2OneCallHandler();
    }

    @Bean
    public One2OneUserRegistry registry() {
        return new One2OneUserRegistry();
    }

    @Bean
    public RoomManager roomManager() {
        return new RoomManager();
    }

    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create();
    }

    @Bean
    public ServletServerContainerFactoryBean createServletServerContainerFactoryBean() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(32768);
        return container;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(groupCallHandler(), "/groupcall").setAllowedOriginPatterns("*");
        registry.addHandler(callHandler(), "/call").setAllowedOriginPatterns("*");
    }
}
