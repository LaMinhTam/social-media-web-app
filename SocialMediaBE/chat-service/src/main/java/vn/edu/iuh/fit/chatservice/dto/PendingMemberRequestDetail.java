package vn.edu.iuh.fit.chatservice.dto;

import org.bson.types.ObjectId;
import vn.edu.iuh.fit.chatservice.entity.PendingMemberRequest;
import vn.edu.iuh.fit.chatservice.model.UserDetail;

import java.util.Date;
import java.util.Map;

public record PendingMemberRequestDetail(
        String id,
        UserDetail requester,
        UserDetail waitingMember,
        Date createdAt
) {
    public static PendingMemberRequestDetail create(PendingMemberRequest pendingMemberRequest, Map<Long, UserDetail> userDetailMap) {
        return new PendingMemberRequestDetail(
                pendingMemberRequest.getId().toHexString(),
                userDetailMap.get(pendingMemberRequest.getRequesterId()),
                userDetailMap.get(pendingMemberRequest.getMemberId()),
                pendingMemberRequest.getCreatedAt()
        );
    }
}
