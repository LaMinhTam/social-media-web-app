package vn.edu.iuh.fit.chatservice.entity.conversation;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(collection = "conversations")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Conversation {
    @MongoId
    @Column(name = "id")
    @JsonProperty("id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private ObjectId id;
    @Column(name = "owner_id")
    @JsonProperty("owner_id")
    private Long ownerId;
    @Column(name = "deputies")
    @JsonProperty("deputies")
    private List<Long> deputies;
    @Enumerated(EnumType.ORDINAL)
    private ConversationType type;
    private String name;
    private String avatar;
    private List<Long> members;
    @Column(name = "last_message_id")
    @JsonProperty("last_message_id")
    private String lastMessageId;
    @Column(name = "last_activity")
    @JsonProperty("last_activity")
    private Date lastActivity;
    private ConversationSettings settings;
    private ConversationStatus status;
    private Map<String, String> views;
    @Column(name = "muted_status")
    @JsonProperty("muted_status")
    private Map<String, Boolean> mutedStatus;
    private Map<String, Boolean> notificationSettings;
    @Column(name = "pinned_messages")
    @JsonProperty("pinned_messages")
    private List<String> pinnedMessages;
    @Column(name = "created_at")
    @JsonProperty("created_at")
    private Date createdAt;
    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private Date updatedAt;

}