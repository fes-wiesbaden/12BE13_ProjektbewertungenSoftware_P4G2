package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;
import java.util.UUID;

public record SchoolClassAndLearningFieldDto (
        UUID id,
        String courseName,
        String className,
        List<UUID> learningFieldIds,
        List<String> learningFieldNames
){}