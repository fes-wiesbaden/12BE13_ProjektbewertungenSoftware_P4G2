package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;
import java.util.UUID;

import de.assessify.app.assessifyapi.api.entity.TrainingModule;

public record SchoolClassDto (
        UUID id,
        String courseName,
        String className,
        List<TrainingModuleSummaryDto> trainingModules
) {}
