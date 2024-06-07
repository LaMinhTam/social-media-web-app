package vn.edu.iuh.fit.chatservice.entity.message;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;

@Document(collection = "messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    @MongoId
    @Column(name = "id")
    @JsonProperty("id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private ObjectId id;
    @Column(name = "conversation_id")
    @JsonProperty("conversation_id")
    private String conversationId;
    @Column(name = "sender_id")
    @JsonProperty("sender_id")
    private Long senderId;
    @Column(name = "tagged_user_id")
    @JsonProperty("tagged_user_id")
    private List<Long> taggedUserId;
    private String content;
    private List<String> media;
    private String status;
    @Enumerated(EnumType.ORDINAL)
    private MessageType type;
    private List<Reaction> reactions;
    @Column(name = "created_at")
    @JsonProperty("created_at")
    private Date createdAt;
    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private Date updatedAt;
}