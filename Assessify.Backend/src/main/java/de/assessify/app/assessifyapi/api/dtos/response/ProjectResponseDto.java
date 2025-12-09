package de.assessify.app.assessifyapi.api.dtos.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProjectResponseDto(
        Integer id,
        Integer classId,
        String className,
        Integer academicYearId,
        String academicYearName,
        String name,
        String description,
        LocalDate startDate,
        LocalDate dueDate,
        Integer createdBy,
        String creatorName,
        String status,
        LocalDateTime reviewDeadline,
        LocalDateTime creationDate,
        Integer totalGroups,
        Integer totalReviewQuestions,
        List<GroupResponseDto> groups,
        List<ReviewQuestionResponseDto> reviewQuestions
) {}
