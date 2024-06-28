package vn.edu.iuh.fit.chatservice.service.impl;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.chatservice.client.UserClient;
import vn.edu.iuh.fit.chatservice.dto.*;
import vn.edu.iuh.fit.chatservice.entity.PendingMemberRequest;
import vn.edu.iuh.fit.chatservice.entity.conversation.Conversation;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationSettings;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationStatus;
import vn.edu.iuh.fit.chatservice.entity.conversation.ConversationType;
import vn.edu.iuh.fit.chatservice.entity.message.Message;
import vn.edu.iuh.fit.chatservice.entity.message.MessageType;
import vn.edu.iuh.fit.chatservice.entity.message.NotificationType;
import vn.edu.iuh.fit.chatservice.exception.AppException;
import vn.edu.iuh.fit.chatservice.message.MessageNotificationProducer;
import vn.edu.iuh.fit.chatservice.model.UserDetail;
import vn.edu.iuh.fit.chatservice.repository.ConversationRepository;
import vn.edu.iuh.fit.chatservice.repository.MessageRepository;
import vn.edu.iuh.fit.chatservice.repository.PendingMemberRequestRepository;
import vn.edu.iuh.fit.chatservice.service.ConversationService;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ConversationServiceImpl implements ConversationService {
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserClient userClient;
    private final MessageNotificationProducer messageNotificationProducer;
    private final PendingMemberRequestRepository pendingMemberRequestRepository;

    public ConversationServiceImpl(ConversationRepository conversationRepository, MessageRepository messageRepository, UserClient userClient, MessageNotificationProducer messageNotificationProducer, PendingMemberRequestRepository pendingMemberRequestRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userClient = userClient;
        this.messageNotificationProducer = messageNotificationProducer;
        this.pendingMemberRequestRepository = pendingMemberRequestRepository;
    }

    public String createPrivateConversation(List<Long> members) {
        return conversationRepository.findConversationByMembersAndType(members, ConversationType.PRIVATE)
                .map(existConversation -> existConversation.getId().toHexString())
                .orElseGet(() -> {
                    Conversation conversation = new Conversation(ConversationType.PRIVATE, members, ConversationStatus.ACTIVE);
                    Conversation savedConversation = conversationRepository.save(conversation);
                    return savedConversation.getId().toHexString();
                });
    }

    public String createGroupConversation(Long id, String name, String image, List<Long> members) {
        Conversation conversation = new Conversation(id, ConversationType.GROUP, name, image, members, ConversationStatus.ACTIVE);
        Conversation savedConversation = conversationRepository.save(conversation);
        ConversationDTO conversationDTO = createConversationDTO(savedConversation, members);
        messageNotificationProducer.notifyConversation(conversationDTO);
        return savedConversation.getId().toHexString();
    }

    @Override
    public String createConversation(Long id, String name, String image, List<Long> members, ConversationType conversationType) {
        List<UserDetail> userDetails = userClient.getUsersByIds(members);
        if (members.size() != userDetails.size()) {
            throw new AppException(HttpStatus.NOT_FOUND.value(), "One or more members not found");
        }
        return conversationType.equals(ConversationType.PRIVATE)
                ? createPrivateConversation(members)
                : createGroupConversation(id, name, image, members);
    }

    @Override
    public ConversationDTO getConversation(Long userId, String conversationId) {
        Conversation conversation = getConversationById(conversationId, userId);
        Map<Long, UserDetail> userModels = userClient.getUsersByIdsMap(conversation.getMembers());
        Map<String, Message> messages = messageRepository.findLastMessagesByConversationIdIn(userId, List.of(conversation.getId().toHexString()));
        MessageDetailDTO messageDetail = messages.containsKey(conversationId)
                ? MessageDetailDTO.createMessageDetailDTO(messages.get(conversationId), userModels)
                : null;

        return new ConversationDTO(conversation, userModels, userId, messageDetail);
    }

    @Override
    public Conversation getPlainConversation(Long userId, String conversationId) {
        return getConversationById(conversationId, userId);
    }

    @Override
    public List<ConversationDTO> findConversationsByUserId(Long userId) {
        List<Conversation> conversations = conversationRepository.findByMembersAndStatus(List.of(userId), ConversationStatus.ACTIVE);
        Map<String, Message> messages = messageRepository.findLastMessagesByConversationIdIn(userId, conversations.stream().map(conversation -> conversation.getId().toHexString()).toList());
        Set<Long> memberIds = conversations.stream()
                .flatMap(conversation -> conversation.getMembers().stream())
                .collect(Collectors.toSet());
        Map<Long, UserDetail> userModels = userClient.getUsersByIdsMap(memberIds);
        List<ConversationDTO> conversationDTOS = conversations.stream()
                .map(conversation -> buildConversationDTO(conversation, messages, userModels, userId))
                .toList();
        updatePrivateConversationNames(conversationDTOS, userId);

        return conversationDTOS;
    }

    private ConversationDTO buildConversationDTO(Conversation conversation, Map<String, Message> messages, Map<Long, UserDetail> userModels, Long userId) {
        Message lastMessage = messages.get(conversation.getId().toHexString());
        MessageDetailDTO messageDetailDTO = (lastMessage != null) ? MessageDetailDTO.createMessageDetailDTO(lastMessage, userModels) : null;
        Map<Long, UserDetail> userDetailMap = conversation.getMembers().stream()
                .collect(Collectors.toMap(memberId -> memberId, userModels::get));
        return new ConversationDTO(conversation, userDetailMap, userId, messageDetailDTO);
    }

    private void updatePrivateConversationNames(List<ConversationDTO> conversationDTOS, Long userId) {
        conversationDTOS.forEach(currentConversation -> {
            if (currentConversation.getType().equals(ConversationType.PRIVATE)) {
                UserDetail userDetail = currentConversation.getOtherMember(userId);
                if (userDetail != null) {
                    currentConversation.setName(userDetail.name());
                    currentConversation.setImage(userDetail.image_url());
                }
            }
        });
    }

    @Override
    public Conversation disbandConversation(Long userId, String conversationId) {
        Conversation conversation = getConversationById(conversationId, userId);
        validateDisbandConversation(userId, conversation);
        conversation.setStatus(ConversationStatus.DISBAND);
        Message message = new Message(conversationId, userId, MessageType.NOTIFICATION, NotificationType.DISBAND_GROUP);
        saveAndNotify(message, conversation);
        return conversationRepository.save(conversation);
    }

    private void validateDisbandConversation(Long userId, Conversation conversation) {
        if (conversation.getType().equals(ConversationType.PRIVATE)) {
            throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "You cannot disband a private conversation");
        } else if (!conversation.getOwnerId().equals(userId)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not the owner of this conversation");
        }
    }


    @Override
    public SimpleConversationDTO addMember(Long userId, String conversationId, List<Long> newMembers) {
        Conversation conversation = getConversationById(conversationId, userId);
        validateAddMember(conversation, userId);
        if (conversation.getType().equals(ConversationType.PRIVATE)) {
            throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "You can not add member to a private conversation");
        }
        newMembers = filterNewMembers(conversation, newMembers);
        newMembers.forEach(newMemberId -> {
            if (conversation.getSettings().isConfirmNewMember() && !conversation.getOwnerId().equals(userId)) {
                pendingMemberRequestRepository.save(new PendingMemberRequest(conversation.getId().toHexString(), userId, newMemberId));
            } else {
                conversation.getMembers().add(newMemberId);
                Message message = new Message(conversationId, userId, List.of(newMemberId), MessageType.NOTIFICATION, NotificationType.ADD_MEMBER);
                saveAndNotify(message, conversation);
            }
        });

        return saveAndReturnDTO(conversation);
    }

    private void validateAddMember(Conversation conversation, Long userId) {
        if (conversation.getType().equals(ConversationType.PRIVATE)) {
            throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "You cannot add member to a private conversation");
        }
        if (!conversation.getOwnerId().equals(userId) &&
                !conversation.getSettings().isAllowMemberToInviteMember() &&
                !(conversation.getSettings().isAllowDeputyToInviteMember() &&
                        conversation.getDeputies() != null &&
                        conversation.getDeputies().contains(userId))) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not allowed to invite members");
        }
    }

    private List<Long> filterNewMembers(Conversation conversation, List<Long> newMembers) {
        // Filter out members who are already in the conversation
        List<Long> filteredMembers = newMembers.stream().filter(memberId -> !conversation.getMembers().contains(memberId)).toList();
        if (filteredMembers.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "All members are already in this conversation");
        }
        // Get the list of pending member requests
        List<PendingMemberRequest> pendingMemberRequests = pendingMemberRequestRepository.findByConversationId(conversation.getId().toHexString());
        // Filter out members who are already in the pending list
        filteredMembers = filteredMembers.stream().filter(newMemberId -> pendingMemberRequests.stream().noneMatch(pendingMemberRequest -> pendingMemberRequest.getMemberId().equals(newMemberId))).toList();
        if (filteredMembers.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "All new members are already in the pending list");
        }
        return filteredMembers;
    }

    @Override
    public List<PendingMemberRequestDetail> getPendingMemberRequests(String conversationId) {
        List<PendingMemberRequest> pendingMemberRequests = pendingMemberRequestRepository.findByConversationId(conversationId);
        Set<Long> userIds = pendingMemberRequests.stream().flatMap(pendingMemberRequest -> Stream.of(pendingMemberRequest.getRequesterId(), pendingMemberRequest.getMemberId())).collect(Collectors.toSet());
        Map<Long, UserDetail> userDetailMap = userClient.getUsersByIdsMap(userIds);
        return pendingMemberRequests.stream().map(pendingMemberRequest -> PendingMemberRequestDetail.create(pendingMemberRequest, userDetailMap)).toList();
    }

    @Override
    public void approvePendingMemberRequest(Long userId, String conversationId, Long requesterId, Long waitingMemberId) {
        Conversation conversation = getConversationById(conversationId, userId);
        validateUpdatePendingMemberRequest(userId, conversation);
        PendingMemberRequest pendingMemberRequest = pendingMemberRequestRepository.findByConversationIdAndRequesterIdAndMemberId(conversationId, requesterId, waitingMemberId).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Pending member request not found"));
        conversation.getMembers().add(waitingMemberId);
        pendingMemberRequestRepository.delete(pendingMemberRequest);
        conversationRepository.save(conversation);
        Message message = new Message(conversationId, userId, List.of(waitingMemberId), MessageType.NOTIFICATION, NotificationType.ADD_MEMBER);
        saveAndNotify(message, conversation);
    }

    @Override
    public void rejectPendingMemberRequest(Long userId, String conversationId, Long requesterId, Long waitingMemberId) {
        Conversation conversation = getConversationById(conversationId, userId);
        validateUpdatePendingMemberRequest(userId, conversation);
        PendingMemberRequest pendingMemberRequest = pendingMemberRequestRepository.findByConversationIdAndRequesterIdAndMemberId(conversationId, requesterId, waitingMemberId).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Pending member request not found"));
        pendingMemberRequestRepository.delete(pendingMemberRequest);
    }

    private void validateUpdatePendingMemberRequest(Long userId, Conversation conversation) {
        if (!conversation.getOwnerId().equals(userId) &&
                !Optional.ofNullable(conversation.getDeputies()).orElse(Collections.emptyList()).contains(userId)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not allowed to approve member request");
        }
    }

    @Override
    public ConversationDTO joinByLink(Long id, String link) {
        Conversation conversation = conversationRepository.findByLink(link).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Link not found"));
        if (conversation.getMembers().contains(id)) {
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "You are already a member of this conversation");
        }
        if (!conversation.getSettings().isJoinByLink()) {
            throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "This conversation does not allow join by link");
        }
        if (conversation.getSettings().isConfirmNewMember()) {
            pendingMemberRequestRepository.save(new PendingMemberRequest(conversation.getId().toHexString(), id, id));
        } else {
            conversation.getMembers().add(id);
            Message message = new Message(conversation.getId().toHexString(), id, MessageType.NOTIFICATION, NotificationType.JOIN_BY_LINK);
            saveAndNotify(message, conversation);
        }
        return createConversationDTO(conversationRepository.save(conversation), conversation.getMembers());
    }

    @Override
    public ConversationDTO findByLink(String link) {
        Conversation conversation = conversationRepository.findByLink(link).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Link not found"));
        return createConversationDTO(conversation, conversation.getMembers());
    }

    @Override
    public Conversation leaveConversation(Long id, String conversationId) {
        Conversation conversation = getConversationById(conversationId, id);
        if (conversation.getType().equals(ConversationType.PRIVATE)) {
            throw new AppException(HttpStatus.METHOD_NOT_ALLOWED.value(), "You can not leave a private conversation");
        }
        if (conversation.getOwnerId().equals(id)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are the owner of this conversation");
        }
        conversation.getMembers().remove(id);
        Message message = new Message(conversationId, id, MessageType.NOTIFICATION, NotificationType.LEAVE_GROUP);
        saveAndNotify(message, conversation);
        return conversationRepository.save(conversation);
    }

    @Override
    public Conversation changeName(Long id, String conversationId, String name) {
        Conversation conversation = getConversationById(conversationId, id);
        validateChangeGroupInfo(conversation, id);

        conversation.setName(name);
        Message message = new Message(conversationId, id, name, MessageType.NOTIFICATION, NotificationType.CHANGE_GROUP_NAME);
        saveAndNotify(message, conversation);
        return conversationRepository.save(conversation);
    }

    @Override
    public Conversation changeImage(Long id, String conversationId, String image) {
        Conversation conversation = getConversationById(conversationId, id);
        validateChangeGroupInfo(conversation, id);
        conversation.setAvatar(image);
        saveAndNotify(new Message(conversationId, id, image, MessageType.NOTIFICATION, NotificationType.CHANGE_GROUP_AVATAR), conversation);
        return conversationRepository.save(conversation);
    }

    private void validateChangeGroupInfo(Conversation conversation, Long id) {
        if (!conversation.getOwnerId().equals(id) &&
                !conversation.getSettings().isAllowMemberToChangeGroupInfo() &&
                !(conversation.getSettings().isAllowDeputyChangeGroupInfo() && conversation.getDeputies() != null && conversation.getDeputies().contains(id))) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not allowed to change group info");
        }
    }

    @Override
    public Conversation grantOwner(Long adminId, String conversationId, Long memberId) {
        Conversation conversation = validateConversationAndAdmin(conversationId, adminId);
        validateMemberInConversation(conversation, memberId);
        conversation.setOwnerId(memberId);
        saveAndNotify(new Message(conversationId, adminId, List.of(memberId), MessageType.NOTIFICATION, NotificationType.CHANGE_GROUP_OWNER), conversation);
        return conversationRepository.save(conversation);
    }

    @Override
    public SimpleConversationDTO kickMember(Long senderId, String conversationId, Long memberId) {
        Conversation conversation = getConversationById(conversationId, senderId);
        validateMemberInConversation(conversation, memberId);
        validateKickMember(conversation, senderId, memberId);

        Message message = new Message(conversationId, senderId, List.of(memberId), MessageType.NOTIFICATION, NotificationType.REMOVE_MEMBER);
        Conversation copyOfConversation = new Conversation(conversation);
        saveAndNotify(message, copyOfConversation);
        conversation.getMembers().remove(memberId);
        Optional.ofNullable(conversation.getDeputies()).ifPresent(deputies -> deputies.remove(memberId));
        return saveAndReturnDTO(conversation);
    }

    private void validateKickMember(Conversation conversation, Long senderId, Long memberId) {
        if (!conversation.getOwnerId().equals(senderId) &&
                !conversation.getSettings().isAllowDeputyRemoveMember() &&
                !(conversation.getDeputies() != null && conversation.getDeputies().contains(senderId))) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not allowed to kick member");
        }
        if (memberId.equals(conversation.getOwnerId())) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You cannot kick the owner of this conversation");
        }
    }

    @Override
    public SimpleConversationDTO grantDeputy(Long senderId, String conversationId, Long memberId) {
        Conversation conversation = getConversationById(conversationId, senderId);
        validateMemberInConversation(conversation, memberId);
        validateGrantDeputy(conversation, senderId, memberId);
        conversation.getDeputies().add(memberId);
        saveAndNotify(new Message(conversationId, senderId, List.of(memberId), MessageType.NOTIFICATION, NotificationType.GRANT_DEPUTY), conversation);
        return saveAndReturnDTO(conversation);
    }

    private void validateGrantDeputy(Conversation conversation, Long senderId, Long memberId) {
        if (conversation.getDeputies() == null) {
            conversation.setDeputies(new ArrayList<>());
        }
        if (conversation.getDeputies().contains(memberId)) {
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "Member is already a deputy");
        }
        if (!conversation.getOwnerId().equals(senderId) && !(conversation.getSettings().isAllowDeputyPromoteMember() && conversation.getDeputies().contains(senderId))) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not allowed to grant deputy");
        }

    }

    @Override
    public SimpleConversationDTO revokeDeputy(Long senderId, String conversationId, Long memberId) {
        Conversation conversation = getConversationById(conversationId, senderId);
        if (!conversation.getMembers().contains(memberId)) {
            throw new AppException(HttpStatus.NOT_FOUND.value(), "Member not found in this conversation");
        }
        if (!conversation.getOwnerId().equals(senderId) && !(conversation.getSettings().isAllowDeputyDemoteMember() && conversation.getDeputies() != null && conversation.getDeputies().contains(senderId))) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not allowed to revoke deputy");
        }

        conversation.getDeputies().remove(memberId);
        saveAndNotify(new Message(conversationId, senderId, List.of(memberId), MessageType.NOTIFICATION, NotificationType.REVOKE_DEPUTY), conversation);
        return saveAndReturnDTO(conversation);
    }

    @Override
    public ConversationSettings updateConversationSettings(Long adminId, String conversationId, ConversationSettingsRequest settings) {
        Conversation conversation = getConversationById(conversationId, adminId);
        ConversationSettings oldSettings = conversation.getSettings();
        String linkToJoinGroup = settings.isJoinByLink() && oldSettings.getLinkToJoinGroup().isEmpty() ? UUID.randomUUID().toString() : oldSettings.getLinkToJoinGroup();
        ConversationSettings newSettings = new ConversationSettings(settings, linkToJoinGroup);
        conversation.setSettings(newSettings);
        List<Message> notificationMessages = generateSettingsChangeMessages(conversationId, adminId, oldSettings, newSettings);
        notificationMessages.forEach(message -> saveAndNotify(message, conversation));
        Conversation savedConversation = conversationRepository.save(conversation);
        return savedConversation.getSettings();
    }

    private List<Message> generateSettingsChangeMessages(String conversationId, Long adminId, ConversationSettings oldSettings, ConversationSettings newSettings) {
        List<Message> messages = new ArrayList<>();

        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.CONFIRM_NEW_MEMBER, oldSettings.isConfirmNewMember(), newSettings.isConfirmNewMember());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.RESTRICTED_MESSAGING, oldSettings.isRestrictedMessaging(), newSettings.isRestrictedMessaging());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.DEPUTY_SEND_MESSAGES, oldSettings.isAllowDeputySendMessages(), newSettings.isAllowDeputySendMessages());
        addMessageIfSettingChanged(messages, conversationId, adminId, oldSettings.isJoinByLink(), newSettings.isJoinByLink(), newSettings.getLinkToJoinGroup());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.MEMBER_CHANGE_GROUP_INFO, oldSettings.isAllowMemberToChangeGroupInfo(), newSettings.isAllowMemberToChangeGroupInfo());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.DEPUTY_INVITE_MEMBER, oldSettings.isAllowDeputyToInviteMember(), newSettings.isAllowDeputyToInviteMember());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.MEMBER_INVITE_MEMBER, oldSettings.isAllowMemberToInviteMember(), newSettings.isAllowMemberToInviteMember());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.DEPUTY_REMOVE_MEMBER, oldSettings.isAllowDeputyRemoveMember(), newSettings.isAllowDeputyRemoveMember());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.DEPUTY_CHANGE_GROUP_INFO, oldSettings.isAllowDeputyChangeGroupInfo(), newSettings.isAllowDeputyChangeGroupInfo());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.MEMBER_PIN_MESSAGE, oldSettings.isAllowMemberToPinMessage(), newSettings.isAllowMemberToPinMessage());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.DEPUTY_PROMOTE_MEMBER, oldSettings.isAllowDeputyPromoteMember(), newSettings.isAllowDeputyPromoteMember());
        addMessageIfSettingChanged(messages, conversationId, adminId, NotificationType.DEPUTY_DEMOTE_MEMBER, oldSettings.isAllowDeputyDemoteMember(), newSettings.isAllowDeputyDemoteMember());

        return messages;
    }

    private void addMessageIfSettingChanged(List<Message> messages, String conversationId, Long adminId, NotificationType type, boolean oldSetting, boolean newSetting) {
        if (oldSetting != newSetting) {
            messages.add(createNotificationMessageForUpdateSetting(conversationId, adminId, type, Boolean.toString(newSetting)));
        }
    }

    // Overloaded method for handling join by link setting, which requires a string value instead of a boolean
    private void addMessageIfSettingChanged(List<Message> messages, String conversationId, Long adminId, boolean oldSetting, boolean newSetting, String newValue) {
        if (oldSetting != newSetting) {
            messages.add(createNotificationMessageForUpdateSetting(conversationId, adminId, NotificationType.JOIN_BY_LINK, newValue));
        }
    }

    private ConversationDTO createConversationDTO(Conversation conversation, List<Long> members) {
        Map<Long, UserDetail> userModels = userClient.getUsersByIds(members).stream().collect(Collectors.toMap(UserDetail::user_id, u -> u));
        return new ConversationDTO(conversation, userModels, conversation.getOwnerId(), null);
    }

    private Message createNotificationMessageForUpdateSetting(String conversationId, Long adminId, NotificationType type, String content) {
        return new Message(conversationId, adminId, content, MessageType.NOTIFICATION, type);
    }

    private Conversation validateConversationAndAdmin(String conversationId, Long adminId) {
        Conversation conversation = conversationRepository.findById(new ObjectId(conversationId), adminId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found or you are not a member of this conversation"));
        if (!conversation.getOwnerId().equals(adminId)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not the owner of this conversation");
        }
        return conversation;
    }

    private SimpleConversationDTO saveAndReturnDTO(Conversation conversation) {
        Conversation savedConversation = conversationRepository.save(conversation);
        return new SimpleConversationDTO(savedConversation);
    }

    private Conversation getConversationById(String conversationId, Long userId) {
        return conversationRepository.findById(new ObjectId(conversationId), userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Conversation not found or you are not a member of this conversation"));
    }

    private void validateMemberInConversation(Conversation conversation, Long memberId) {
        if (!conversation.getMembers().contains(memberId)) {
            throw new AppException(HttpStatus.NOT_FOUND.value(), "Member not found in this conversation");
        }
    }

    private void saveAndNotify(Message message, Conversation conversation) {
        messageRepository.save(message);
        messageNotificationProducer.notifyConversationMembers(conversation, message, "message");
    }

}
