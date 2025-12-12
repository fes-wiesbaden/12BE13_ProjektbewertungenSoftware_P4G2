package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record ProjectNamesResponseDto(
        UUID id,
        String name
) {
}
