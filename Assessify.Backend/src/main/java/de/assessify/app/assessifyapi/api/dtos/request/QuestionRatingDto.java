package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.List;
import java.util.UUID;

public record QuestionRatingDto(
        UUID questionId,
        List<MemberRatingDto> ratings
) {
}
