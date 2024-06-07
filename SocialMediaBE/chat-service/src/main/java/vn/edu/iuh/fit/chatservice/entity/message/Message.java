//package vn.edu.iuh.fit.chatservice.entity.message;
//
//import com.fasterxml.jackson.annotation.JsonProperty;
//import jakarta.persistence.Column;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//import java.util.Date;
//import java.util.List;
//
//@Document(collection = "messages")
//public class Message {
//    @Id
//    private String id;
//    @Column(name = "conversation_id")
//    @JsonProperty("conversation_id")
//    private String conversationId;
//    @Column(name = "sender_id")
//    @JsonProperty("sender_id")
//    private String senderId;
//    @Column(name = "tagged_user_id")
//    @JsonProperty("tagged_user_id")
//    private String taggedUserId;
//    private String content;
//    private List<String> media;
//    private String status;
//    @Enumerated(EnumType.ORDINAL)
//    private MessageType type;
//    private List<Reaction> reactions;
//    @Column(name = "created_at")
//    @JsonProperty("created_at")
//    private Date createdAt;
//    @Column(name = "updated_at")
//    @JsonProperty("updated_at")
//    private Date updatedAt;
//
//    public Message() {
//    }
//
//    public Message(String id, String conversationId, String senderId, String taggedUserId, String content, List<String> media, String status, MessageType type, List<Reaction> reactions, Date createdAt, Date updatedAt) {
//        this.id = id;
//        this.conversationId = conversationId;
//        this.senderId = senderId;
//        this.taggedUserId = taggedUserId;
//        this.content = content;
//        this.media = media;
//        this.status = status;
//        this.type = type;
//        this.reactions = reactions;
//        this.createdAt = createdAt;
//        this.updatedAt = updatedAt;
//    }
//
//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }
//
//    public String getConversationId() {
//        return conversationId;
//    }
//
//    public void setConversationId(String conversationId) {
//        this.conversationId = conversationId;
//    }
//
//    public String getSenderId() {
//        return senderId;
//    }
//
//    public void setSenderId(String senderId) {
//        this.senderId = senderId;
//    }
//
//    public String getTaggedUserId() {
//        return taggedUserId;
//    }
//
//    public void setTaggedUserId(String taggedUserId) {
//        this.taggedUserId = taggedUserId;
//    }
//
//    public MessageType getType() {
//        return type;
//    }
//
//    public void setType(MessageType type) {
//        this.type = type;
//    }
//
//    public String getContent() {
//        return content;
//    }
//
//    public void setContent(String content) {
//        this.content = content;
//    }
//
//    public List<String> getMedia() {
//        return media;
//    }
//
//    public void setMedia(List<String> media) {
//        this.media = media;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public List<Reaction> getReactions() {
//        return reactions;
//    }
//
//    public void setReactions(List<Reaction> reactions) {
//        this.reactions = reactions;
//    }
//
//    public Date getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(Date createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public Date getUpdatedAt() {
//        return updatedAt;
//    }
//
//    public void setUpdatedAt(Date updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//}