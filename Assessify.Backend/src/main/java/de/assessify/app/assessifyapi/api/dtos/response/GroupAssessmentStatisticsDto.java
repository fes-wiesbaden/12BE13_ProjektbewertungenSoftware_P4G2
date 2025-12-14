package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;
import java.util.UUID;

public record GroupAssessmentStatisticsDto(
        UUID groupId,
        Integer totalMembers,
        Integer totalSubmittedReviews,
        Integer totalExpectedReviews,
        Double completionPercentage,
        List<MemberStatisticsDto> memberStatistics
) {
}
