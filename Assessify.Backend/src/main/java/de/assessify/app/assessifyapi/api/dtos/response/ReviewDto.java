package de.assessify.app.assessifyapi.api.dtos.response;

import de.assessify.app.assessifyapi.api.entity.ReviewAnswer;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ReviewDto(
        UUID id,
        UUID groupId,
        UUID userId,
        LocalDate date,
        List<ReviewAnswerDto> answers
) {}