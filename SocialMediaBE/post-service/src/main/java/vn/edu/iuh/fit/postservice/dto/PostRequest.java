package vn.edu.iuh.fit.postservice.dto;

import java.util.List;

public record PostRequest(List<Long> coAuthor, String content, List<String> media) {
}
