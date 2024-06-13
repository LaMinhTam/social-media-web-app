package vn.edu.iuh.fit.notificationservice.dto;

import java.util.*;

public class Conversation {
    private String id;
    private Long ownerId;
    private List<Long> deputies = new ArrayList<>();
    private ConversationType type;
    private String name;
    private String avatar;
    private List<Long> members = new ArrayList<>();
    private String lastMessageId;
    private Date lastActivity;
    private ConversationSettings settings;
    private ConversationStatus status;
    private Map<String, String> views = new HashMap<>();
    private Map<String, Boolean> mutedStatus = new HashMap<>();
    private Map<String, Boolean> notificationSettings = new HashMap<>();
    private List<String> pinnedMessages = new ArrayList<>();
    private Date createdAt;
    private Date updatedAt;
    private Map<Long, String> readBy = new HashMap<>();

    public Conversation() {
    }

    public Conversation(String id, Long ownerId, List<Long> deputies, ConversationType type, String name, String avatar, List<Long> members, String lastMessageId, Date lastActivity, ConversationSettings settings, ConversationStatus status, Map<String, String> views, Map<String, Boolean> mutedStatus, Map<String, Boolean> notificationSettings, List<String> pinnedMessages, Date createdAt, Date updatedAt, Map<Long, String> readBy) {
        this.id = id;
        this.ownerId = ownerId;
        this.deputies = deputies;
        this.type = type;
        this.name = name;
        this.avatar = avatar;
        this.members = members;
        this.lastMessageId = lastMessageId;
        this.lastActivity = lastActivity;
        this.settings = settings;
        this.status = status;
        this.views = views;
        this.mutedStatus = mutedStatus;
        this.notificationSettings = notificationSettings;
        this.pinnedMessages = pinnedMessages;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.readBy = readBy;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public List<Long> getDeputies() {
        return deputies;
    }

    public void setDeputies(List<Long> deputies) {
        this.deputies = deputies;
    }

    public ConversationType getType() {
        return type;
    }

    public void setType(ConversationType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public List<Long> getMembers() {
        return members;
    }

    public void setMembers(List<Long> members) {
        this.members = members;
    }

    public String getLastMessageId() {
        return lastMessageId;
    }

    public void setLastMessageId(String lastMessageId) {
        this.lastMessageId = lastMessageId;
    }

    public Date getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(Date lastActivity) {
        this.lastActivity = lastActivity;
    }

    public ConversationSettings getSettings() {
        return settings;
    }

    public void setSettings(ConversationSettings settings) {
        this.settings = settings;
    }

    public ConversationStatus getStatus() {
        return status;
    }

    public void setStatus(ConversationStatus status) {
        this.status = status;
    }

    public Map<String, String> getViews() {
        return views;
    }

    public void setViews(Map<String, String> views) {
        this.views = views;
    }

    public Map<String, Boolean> getMutedStatus() {
        return mutedStatus;
    }

    public void setMutedStatus(Map<String, Boolean> mutedStatus) {
        this.mutedStatus = mutedStatus;
    }

    public Map<String, Boolean> getNotificationSettings() {
        return notificationSettings;
    }

    public void setNotificationSettings(Map<String, Boolean> notificationSettings) {
        this.notificationSettings = notificationSettings;
    }

    public List<String> getPinnedMessages() {
        return pinnedMessages;
    }

    public void setPinnedMessages(List<String> pinnedMessages) {
        this.pinnedMessages = pinnedMessages;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Map<Long, String> getReadBy() {
        return readBy;
    }

    public void setReadBy(Map<Long, String> readBy) {
        this.readBy = readBy;
    }
}