package vn.edu.iuh.fit.chatservice.entity.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reaction {
    private Long userId;
    private ReactionType reaction;
}
