package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.UUID;

public record ReviewQuestionRequestDto(
        String questionText,
        UUID projectId,
        Integer questionOrder
) {
}
