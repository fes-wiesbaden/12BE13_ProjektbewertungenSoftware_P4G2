package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.UUID;

public record AddGroupDto(
    String name,
    UUID projectId
) {}