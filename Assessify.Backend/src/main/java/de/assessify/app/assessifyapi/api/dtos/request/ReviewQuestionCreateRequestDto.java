package de.assessify.app.assessifyapi.api.dtos.request;

import java.util.UUID;

public record ReviewQuestionCreateRequestDto(
        String questionText,
        UUID projectId
) {}