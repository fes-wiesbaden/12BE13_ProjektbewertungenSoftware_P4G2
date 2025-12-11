package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.UUID;

public record GroupCreateRequestDto(
        String groupName,
        UUID projectId
) {
}
