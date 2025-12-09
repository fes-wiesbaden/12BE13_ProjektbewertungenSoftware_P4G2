package de.assessify.app.assessifyapi.api.dtos.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ReviewAnswerResponseDto(
    Integer id,
    Integer reviewId,
    Integer questionId,
    String questionText,
    BigDecimal rate,
    String comment
){}