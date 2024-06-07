package vn.edu.iuh.fit.chatservice.controller;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WebSocketController {
	@MessageMapping("/message")
	@SendTo("/topic/reply")
	public String processMessageFromClient(@Payload String message){
		return "Hello " + message;
	}

	@MessageExceptionHandler
	@SendToUser("/topic/errors")
	public String handleException(Throwable exception) {
		return exception.getMessage();
	}
}
