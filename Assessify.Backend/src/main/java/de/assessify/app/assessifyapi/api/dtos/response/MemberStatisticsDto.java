package de.assessify.app.assessifyapi.api.dtos.response;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

public record MemberStatisticsDto(
        UUID memberId,
        String memberName,
        Double averageRating,
        Integer totalReviewsReceived,
        Map<UUID, Double> questionAverages // questionId -> average rating
) {
}
