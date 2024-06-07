//package vn.edu.iuh.fit.chatservice.entity.conversation;
//
//import com.fasterxml.jackson.annotation.JsonProperty;
//import jakarta.persistence.Column;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import org.bson.types.ObjectId;
//import org.springframework.data.mongodb.core.mapping.Document;
//import org.springframework.data.mongodb.core.mapping.MongoId;
//
//import java.util.Date;
//import java.util.List;
//import java.util.Map;
//
//@Document(collection = "conversations")
//public class Conversation {
//    @MongoId
//    @JsonProperty("_id")
//    private ObjectId id;
//    @Column(name = "owner_id")
//    @JsonProperty("owner_id")
//    private String ownerId;
//    @Enumerated(EnumType.ORDINAL)
//    private ConversationType type;
//    private String name;
//    private String avatar;
//    private List<String> participants;
//    @Column(name = "last_message_id")
//    @JsonProperty("last_message_id")
//    private String lastMessageId;
//    @Column(name = "last_activity")
//    @JsonProperty("last_activity")
//    private Date lastActivity;
//    private ConversationSettings settings;
//    private String status;
//    private Map<String, String> views;
//    @Column(name = "muted_status")
//    @JsonProperty("muted_status")
//    private Map<String, Boolean> mutedStatus;
//    private Map<String, Boolean> notificationSettings;
//    @Column(name = "pinned_messages")
//    @JsonProperty("pinned_messages")
//    private List<String> pinnedMessages;
//    @Column(name = "created_at")
//    @JsonProperty("created_at")
//    private Date createdAt;
//    @Column(name = "updated_at")
//    @JsonProperty("updated_at")
//    private Date updatedAt;
//
//    public Conversation() {
//    }
//
//    public Conversation(ObjectId id, String ownerId, ConversationType type, String name, String avatar, List<String> participants, String lastMessageId, Date lastActivity, ConversationSettings settings, String status, Map<String, String> views, Map<String, Boolean> mutedStatus, Map<String, Boolean> notificationSettings, List<String> pinnedMessages, Date createdAt, Date updatedAt) {
//        this.id = id;
//        this.ownerId = ownerId;
//        this.type = type;
//        this.name = name;
//        this.avatar = avatar;
//        this.participants = participants;
//        this.lastMessageId = lastMessageId;
//        this.lastActivity = lastActivity;
//        this.settings = settings;
//        this.status = status;
//        this.views = views;
//        this.mutedStatus = mutedStatus;
//        this.notificationSettings = notificationSettings;
//        this.pinnedMessages = pinnedMessages;
//        this.createdAt = createdAt;
//        this.updatedAt = updatedAt;
//    }
//
//    public ObjectId getId() {
//        return id;
//    }
//
//    public void setId(ObjectId id) {
//        this.id = id;
//    }
//
//    public String getOwnerId() {
//        return ownerId;
//    }
//
//    public void setOwnerId(String ownerId) {
//        this.ownerId = ownerId;
//    }
//
//    public ConversationType getType() {
//        return type;
//    }
//
//    public void setType(ConversationType type) {
//        this.type = type;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public String getAvatar() {
//        return avatar;
//    }
//
//    public void setAvatar(String avatar) {
//        this.avatar = avatar;
//    }
//
//    public List<String> getParticipants() {
//        return participants;
//    }
//
//    public void setParticipants(List<String> participants) {
//        this.participants = participants;
//    }
//
//    public String getLastMessageId() {
//        return lastMessageId;
//    }
//
//    public void setLastMessageId(String lastMessageId) {
//        this.lastMessageId = lastMessageId;
//    }
//
//    public Date getLastActivity() {
//        return lastActivity;
//    }
//
//    public void setLastActivity(Date lastActivity) {
//        this.lastActivity = lastActivity;
//    }
//
//    public ConversationSettings getSettings() {
//        return settings;
//    }
//
//    public void setSettings(ConversationSettings settings) {
//        this.settings = settings;
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
//    public Map<String, String> getViews() {
//        return views;
//    }
//
//    public void setViews(Map<String, String> views) {
//        this.views = views;
//    }
//
//    public Map<String, Boolean> getMutedStatus() {
//        return mutedStatus;
//    }
//
//    public void setMutedStatus(Map<String, Boolean> mutedStatus) {
//        this.mutedStatus = mutedStatus;
//    }
//
//    public Map<String, Boolean> getNotificationSettings() {
//        return notificationSettings;
//    }
//
//    public void setNotificationSettings(Map<String, Boolean> notificationSettings) {
//        this.notificationSettings = notificationSettings;
//    }
//
//    public List<String> getPinnedMessages() {
//        return pinnedMessages;
//    }
//
//    public void setPinnedMessages(List<String> pinnedMessages) {
//        this.pinnedMessages = pinnedMessages;
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