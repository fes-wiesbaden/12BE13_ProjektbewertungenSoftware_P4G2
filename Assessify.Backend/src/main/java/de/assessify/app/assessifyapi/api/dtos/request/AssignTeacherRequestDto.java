package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.UUID;

public record AssignTeacherRequestDto(
        UUID teacherId,
        UUID classId
) {
}
