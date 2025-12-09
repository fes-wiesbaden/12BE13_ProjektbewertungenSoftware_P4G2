package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.UUID;

public record ReviewQuestionResponseDto(
        Integer id,
        String questionText,
        Integer projectId,
        String projectName,
        Integer questionOrder
) {}
