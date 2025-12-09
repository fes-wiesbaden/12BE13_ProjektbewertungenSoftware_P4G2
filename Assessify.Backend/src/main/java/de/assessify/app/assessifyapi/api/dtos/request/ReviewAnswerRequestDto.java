package de.assessify.app.assessifyapi.api.dtos.request;

import java.math.BigDecimal;
import java.util.UUID;

public record ReviewAnswerRequestDto(
        UUID questionId,
        BigDecimal rate,
        String comment
) {
}
