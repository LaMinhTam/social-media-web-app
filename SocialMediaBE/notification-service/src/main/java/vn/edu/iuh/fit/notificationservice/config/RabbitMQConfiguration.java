package vn.edu.iuh.fit.notificationservice.config;

import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.RabbitListenerContainerFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfiguration {
    @Bean
    public Declarables directBindings() {
        Queue friendRequestQueue = new Queue("friend-request-queue", true);
        Queue messageNotificationQueue = new Queue("message-notification-queue", true);
        Queue readMessageNotificationQueue = new Queue("read-message-notification-queue", true);
        Queue conversationNotificationQueue = new Queue("conversation-notification-queue", true);
        Queue revokeReplyNotificationQueue = new Queue("revoke-reply-notification-queue", true);

        return new Declarables(
                friendRequestQueue,
                messageNotificationQueue,
                readMessageNotificationQueue,
                conversationNotificationQueue,
                revokeReplyNotificationQueue
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