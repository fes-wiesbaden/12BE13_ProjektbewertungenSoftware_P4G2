package de.assessify.app.assessifyapi.api.dtos.request;

import de.assessify.app.assessifyapi.api.dtos.response.ReviewAnswerDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AssessmentSubmissionDto(
        UUID id,
        UUID reviewerId,
        UUID revieweeId,
        UUID groupId,
        String comment,
        Boolean isSubmitted,
        LocalDateTime submissionDate,
        LocalDateTime creationDate,
        List<ReviewAnswerDto> answers,
        List<QuestionRatingDto> questionRatings

) {
}
