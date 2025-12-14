package de.assessify.app.assessifyapi.api.dtos.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ReviewAnswerDto (
        UUID id,
        UUID questionId,
        String questionText,
        Integer rate,
        String comment
){}