package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDate;

public record AcademicYearResponseDto(
         Integer id,
         Integer classId,
         String className,
         Integer yearNumber,
         String yearName,
         LocalDate startDate,
         LocalDate endDate,
         Boolean isCurrent,
         Integer totalProjects
) {
}
