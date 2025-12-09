package de.assessify.app.assessifyapi.api.dtos.request;

import java.math.BigDecimal;
import java.util.UUID;

public record NotenRequestDto(
        UUID studentId,
        UUID lernfeldId,
        UUID classId,
        Integer academicYearId,
        UUID projectId,
        BigDecimal value,
        UUID givenBy,
        String teacherComment
) {}