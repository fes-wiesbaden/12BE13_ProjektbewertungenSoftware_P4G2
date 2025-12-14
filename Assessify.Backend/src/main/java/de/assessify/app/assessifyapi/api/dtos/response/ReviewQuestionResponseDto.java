package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record ReviewQuestionResponseDto(
        UUID id,
        String questionText,
        UUID projectId
) {
}
