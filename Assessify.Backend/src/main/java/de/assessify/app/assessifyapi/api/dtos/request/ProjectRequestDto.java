package de.assessify.app.assessifyapi.api.dtos.request;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ProjectRequestDto(
        UUID classId,
        UUID academicYearId,
        String name,
        String description,
        LocalDate startDate,
        LocalDate dueDate,
        UUID createdBy,
        String status,
        LocalDateTime reviewDeadline
) {}