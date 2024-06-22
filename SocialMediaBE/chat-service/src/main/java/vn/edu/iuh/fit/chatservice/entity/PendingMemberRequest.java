package vn.edu.iuh.fit.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "pending_member_requests")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingMemberRequest {
    @Id
    private ObjectId id;
    private String conversationId;
    private Long requesterId;
    private Long memberId;
    private Date createdAt;

    public PendingMemberRequest(String conversationId, Long requesterId, Long memberId, Date createdAt) {
        this.conversationId = conversationId;
        this.requesterId = requesterId;
        this.memberId = memberId;
        this.createdAt = createdAt;
    }
}
