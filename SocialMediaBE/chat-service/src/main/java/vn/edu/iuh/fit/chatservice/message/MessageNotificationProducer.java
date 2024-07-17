package vn.edu.iuh.fit.chatservice.message;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.chatservice.dto.ConversationDTO;
import vn.edu.iuh.fit.chatservice.dto.MessageNotificationPayload;
import vn.edu.iuh.fit.chatservice.dto.ReadMessageNotificationPayload;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.model.ConversationModel;
import vn.edu.iuh.fit.chatservice.model.MessageModel;

@Service
public class MessageNotificationProducer {
    private final RabbitTemplate rabbitTemplate;

    public MessageNotificationProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void notifyConversationMembers(Conversation conversation, Message message, String destination) {
        MessageNotificationPayload payload = new MessageNotificationPayload(
                new ConversationModel(conversation),
                new MessageModel(message),
                destination
        );
        rabbitTemplate.convertAndSend("message-exchange", "message-key", payload);
    }

    public void notifyRevokeReplyMessage(Conversation conversation, Message message) {
        MessageNotificationPayload payload = new MessageNotificationPayload(
                new ConversationModel(conversation),
                new MessageModel(message),
                "revoke-reply"
        );
        rabbitTemplate.convertAndSend("revoke-reply-exchange", "revoke-reply-key", payload);
    }

    public void notifyConversation(ConversationDTO conversation) {
        rabbitTemplate.convertAndSend("conversation-exchange", "conversation-key", conversation);
    }

    public void notifyRead(Long id, Conversation conversation, Message message) {
        ReadMessageNotificationPayload payload = new ReadMessageNotificationPayload(
                id,
                new ConversationModel(conversation),
                new MessageModel(message)
        );
        rabbitTemplate.convertAndSend("read-message-exchange", "read-message-key", payload);
    }
}
