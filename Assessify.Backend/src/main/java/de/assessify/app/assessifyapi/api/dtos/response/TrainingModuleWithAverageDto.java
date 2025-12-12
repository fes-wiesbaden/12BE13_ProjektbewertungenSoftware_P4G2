package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record TrainingModuleWithAverageDto(
        UUID userId,
        UUID trainingModuleId,
        double averageGrade,
        int weightSum,
        int gradeCount
) {}
