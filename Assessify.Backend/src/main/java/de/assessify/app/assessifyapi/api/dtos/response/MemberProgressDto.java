package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record MemberProgressDto(
        UUID memberId,
        String memberName,
        Integer reviewsGiven,
        Integer reviewsRequired,
        Boolean hasCompletedAllReviews
) {
}
