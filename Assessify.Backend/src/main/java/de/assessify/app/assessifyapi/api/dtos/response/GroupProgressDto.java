package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;

public record GroupProgressDto(
        Integer groupId,
        String groupName,
        Integer projectId,
        String projectName,
        Integer totalMembers,
        Integer totalReviewsRequired,
        Integer totalReviewsCompleted,
        Double completionPercentage,
        List<MemberProgressDto> memberProgress
) {
}
