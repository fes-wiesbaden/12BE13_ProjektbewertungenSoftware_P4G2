package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record TeacherSummaryDto(
    UUID id,
    String username
) {}