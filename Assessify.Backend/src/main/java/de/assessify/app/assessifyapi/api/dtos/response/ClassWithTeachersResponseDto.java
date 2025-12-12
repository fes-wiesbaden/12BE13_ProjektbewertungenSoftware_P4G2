package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;
import java.util.UUID;

public record ClassWithTeachersResponseDto(
    UUID id,
    String courseName,
    String className,
    List<TeacherSummaryDto> teachers,
    int studentCount
) {}