    package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record UserProjectGroupResponseDto(
    UUID id,
    UUID userId,
    String userName,
    UUID projectId,
    UUID groupId,
    String groupName
) {}