package de.assessify.app.assessifyapi.api.dtos.request;

import java.time.LocalDate;
import java.util.UUID;

public record AcademicYearRequestDto(
        UUID classId,
        Integer yearNumber,
        String yearName,
        LocalDate startDate,
        LocalDate endDate,
        boolean isCurrent
) {
}
