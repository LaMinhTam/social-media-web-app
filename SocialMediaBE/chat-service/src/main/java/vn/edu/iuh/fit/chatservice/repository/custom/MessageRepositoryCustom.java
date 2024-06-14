package vn.edu.iuh.fit.chatservice.repository.custom;

import vn.edu.iuh.fit.chatservice.entity.message.Message;

import java.util.List;

public interface MessageRepositoryCustom  {
    List<Message> findMessagesAfterMessageId(String conversationId, String messageId,  int size);
}
