package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.UUID;

public record ClassTeacherAssignRequestDto(
    UUID teacherId,
    UUID classId
) {}