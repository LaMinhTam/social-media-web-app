package vn.edu.iuh.fit.chatservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfiguration {
    @Bean
    public Declarables directBindings() {
        Queue messageNotificationQueue = new Queue("message-notification-queue", true);
        Queue readMessageNotificationQueue = new Queue("read-message-notification-queue", true);
        Queue conversationNotificationQueue = new Queue("conversation-notification-queue", true);
        Queue revokeReplyNotificationQueue = new Queue("revoke-reply-notification-queue", true);
        DirectExchange directExchange = new DirectExchange("message-exchange");
        DirectExchange readDirectExchange = new DirectExchange("read-message-exchange");
        DirectExchange conversationDirectExchange = new DirectExchange("conversation-exchange");
        DirectExchange revokeReplyDirectExchange = new DirectExchange("revoke-reply-exchange");
        return new Declarables(
                messageNotificationQueue,
                readMessageNotificationQueue,
                conversationNotificationQueue,
                revokeReplyNotificationQueue,
                directExchange,
                readDirectExchange,
                conversationDirectExchange,
                revokeReplyDirectExchange,
                BindingBuilder.bind(messageNotificationQueue).to(directExchange).with("message-key"),
                BindingBuilder.bind(readMessageNotificationQueue).to(readDirectExchange).with("read-message-key"),
                BindingBuilder.bind(conversationNotificationQueue).to(conversationDirectExchange).with("conversation-key"),
                BindingBuilder.bind(revokeReplyNotificationQueue).to(revokeReplyDirectExchange).with("revoke-reply-key")
        );
    }

    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(producerJackson2MessageConverter());
        return rabbitTemplate;
    }

    @Bean
    public Jackson2JsonMessageConverter producerJackson2MessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
