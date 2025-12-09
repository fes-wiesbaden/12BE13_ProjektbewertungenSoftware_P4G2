package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDateTime;
import java.util.List;

public record GroupResponseDto(
        Integer id,
        String name,
        Integer projectId,
        String projectName,
        Integer createdBy,
        String creatorName,
        LocalDateTime creationDate,
        Integer totalMembers,
        Integer completedReviews,
        Integer totalReviewsRequired,
        List<GroupMemberResponseDto> members
) {
}
