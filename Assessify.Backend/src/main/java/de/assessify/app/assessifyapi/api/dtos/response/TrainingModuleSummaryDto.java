package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record TrainingModuleSummaryDto(
        UUID id,
        String name,
        String description,
        int weightingHours
) {}
