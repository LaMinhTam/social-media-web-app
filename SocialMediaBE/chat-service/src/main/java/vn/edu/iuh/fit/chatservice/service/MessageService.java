package vn.edu.iuh.fit.chatservice.service;

import vn.edu.iuh.fit.chatservice.dto.MessageFromClientDTO;
import vn.edu.iuh.fit.chatservice.entity.message.Message;

public interface MessageService {
    Message saveMessage(Long userId, MessageFromClientDTO message) throws Exception;
}
