package de.assessify.app.assessifyapi.api.dtos.response;

import java.math.BigDecimal;

public record QuestionAverageDto(
        Integer questionId,
        String questionText,
        BigDecimal averageRating,
        Integer totalResponses
){}