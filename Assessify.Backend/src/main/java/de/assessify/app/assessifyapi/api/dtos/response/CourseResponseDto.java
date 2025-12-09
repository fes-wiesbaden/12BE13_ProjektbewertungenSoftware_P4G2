package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record CourseResponseDto(
        UUID id,
        String code,
        String name,
        String description,
        Integer durationYears,
        LocalDateTime creationDate,
        Integer totalClasses,
        Integer totalLernfelds
) {
}
