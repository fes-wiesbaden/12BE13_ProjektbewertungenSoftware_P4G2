package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ReviewResponseDto(
        UUID id,
        UUID reviewerId,
        UUID revieweeId,
        UUID groupId,
        String comment,
        Boolean isSubmitted,
        LocalDateTime submissionDate,
        LocalDateTime creationDate,
        List<ReviewAnswerDto> answers
) {}