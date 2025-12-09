package de.assessify.app.assessifyapi.api.dtos.response;

import java.math.BigDecimal;
import java.util.List;

public record ReviewSummaryDto(
        Integer studentId,
        String studentName,
        Integer groupId,
        String groupName,
        Integer totalReviewsReceived,
        Integer totalReviewsGiven,
        BigDecimal averageRatingReceived,
        List<QuestionAverageDto> questionAverages,
        List<ReviewResponseDto> detailedReviews
) {
}


