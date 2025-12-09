package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record ProjectProgressDto(
        UUID projectId,
        String projectName,
        String status,
        Integer totalGroups,
        Integer totalStudents,
        Integer completedReviews,
        Double reviewCompletionPercentage
) {
}
