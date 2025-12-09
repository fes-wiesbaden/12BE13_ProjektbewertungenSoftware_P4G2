package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.List;
import java.util.UUID;

public record ReviewRequestDto(
        UUID reviewerId,
        UUID revieweeId,
        UUID groupId,
        String comment,
        Boolean isSubmitted,
        List<ReviewAnswerRequestDto> answers
){}