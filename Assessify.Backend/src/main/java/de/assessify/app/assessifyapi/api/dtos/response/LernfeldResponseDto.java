package de.assessify.app.assessifyapi.api.dtos.response;

import java.math.BigDecimal;

public record LernfeldResponseDto(
        Integer id,
        Integer courseId,
        String courseName,
        String name,
        String description,
        BigDecimal lernfeldWeighting,
        Integer academicYearLevel,
        String academicYearLevelName // "All Years" or "Year 1", "Year 2",
) {
}
