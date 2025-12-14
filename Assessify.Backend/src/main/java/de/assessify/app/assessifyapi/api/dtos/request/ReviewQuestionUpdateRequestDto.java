package de.assessify.app.assessifyapi.api.dtos.request;

public record ReviewQuestionUpdateRequestDto(
        String questionText,
        Integer questionOrder
) {
}
