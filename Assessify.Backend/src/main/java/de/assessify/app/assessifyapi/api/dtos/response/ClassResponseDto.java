package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record ClassResponseDto (
        UUID id,
        String courseName,
        String className
) {}
