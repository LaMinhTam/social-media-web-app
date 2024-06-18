package vn.edu.iuh.fit.postservice.dto;

import vn.edu.iuh.fit.postservice.entity.neo4j.ReactionType;

public record ReactRequest(String target, ReactionType type) {
}
