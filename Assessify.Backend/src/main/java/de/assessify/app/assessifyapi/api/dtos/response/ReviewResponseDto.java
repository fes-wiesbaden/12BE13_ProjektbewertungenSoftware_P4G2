package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ReviewResponseDto(
        Integer id,
        Integer reviewerId,
        String reviewerName,
        Integer revieweeId,
        String revieweeName,
        Integer groupId,
        String groupName,
        String comment,
        Boolean isSubmitted,
        LocalDateTime submissionDate,
        LocalDateTime creationDate,
        List<ReviewAnswerResponseDto> answers,
        Double averageRating
) {}