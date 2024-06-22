package vn.edu.iuh.fit.chatservice.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.fit.chatservice.entity.PendingMemberRequest;

import java.util.List;
import java.util.Optional;

public interface PendingMemberRequestRepository extends MongoRepository<PendingMemberRequest, ObjectId> {
    List<PendingMemberRequest> findByConversationId(String conversationId);
    List<PendingMemberRequest> findByMemberId(Long memberId);

    Optional<PendingMemberRequest> findByConversationIdAndRequesterIdAndMemberId(String conversationId, Long requesterId, Long memberId);
}
