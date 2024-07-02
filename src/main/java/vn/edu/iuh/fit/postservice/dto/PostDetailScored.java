package vn.edu.iuh.fit.postservice.dto;

public class PostDetailScored {
    private final PostDetail postDetail;
    private int totalScore;

    public PostDetailScored(PostDetail postDetail, int totalScore) {
        this.postDetail = postDetail;
        this.totalScore = totalScore;
    }

    public PostDetail getPostDetail() {
        return postDetail;
    }

    public int getTotalScore() {
        return totalScore;
    }

    public void reduceScore(int amount) {
        this.totalScore -= amount;
    }
}