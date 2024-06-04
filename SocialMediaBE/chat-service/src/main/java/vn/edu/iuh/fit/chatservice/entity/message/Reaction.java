package vn.edu.iuh.fit.chatservice.entity.message;

class Reaction {
    private String userId;
    private ReactionType reaction;

    public Reaction() {
    }

    public Reaction(String userId, ReactionType reaction) {
        this.userId = userId;
        this.reaction = reaction;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public ReactionType getReaction() {
        return reaction;
    }

    public void setReaction(ReactionType reaction) {
        this.reaction = reaction;
    }
}
