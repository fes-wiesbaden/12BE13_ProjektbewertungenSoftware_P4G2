package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record ReviewQuestionSummaryDto(
        UUID id,
        String questionText
) {
}
