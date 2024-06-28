package vn.edu.iuh.fit.postservice.dto;

import vn.edu.iuh.fit.postservice.entity.neo4j.Category;

import java.util.List;
import java.util.Set;

public record PostRequest(List<Long> coAuthor, String content, List<String> media, Set<Category> category) {
}
