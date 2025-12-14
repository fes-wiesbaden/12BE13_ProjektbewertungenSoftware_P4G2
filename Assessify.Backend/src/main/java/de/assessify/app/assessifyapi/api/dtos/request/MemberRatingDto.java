package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.UUID;

public record MemberRatingDto(
        UUID revieweeId,
        Integer rating,
        String comment  // optional
) {
}
