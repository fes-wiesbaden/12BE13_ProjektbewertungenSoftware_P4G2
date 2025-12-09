package de.assessify.app.assessifyapi.api.dtos.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

public record NotenResponseDto(
        UUID id,
        Integer studentId,
        String studentName,
        UUID lernfeldId,
        String lernfeldName,
        UUID classId,
        String className,
        Integer academicYearId,
        String academicYearName,
        UUID projectId,
        String projectName,
        BigDecimal value,
        UUID givenBy,
        String givenByName,
        String teacherComment,
        LocalDateTime date
) {}
