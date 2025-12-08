package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record GroupDto(
        UUID id,
        String name,
        UUID projectId
) {}
