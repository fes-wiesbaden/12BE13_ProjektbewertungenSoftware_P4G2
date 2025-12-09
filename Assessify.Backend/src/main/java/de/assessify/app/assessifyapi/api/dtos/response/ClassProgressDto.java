package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;
import java.util.UUID;

public record ClassProgressDto(
        UUID classId,
        String className,
        Integer currentAcademicYear,
        String currentAcademicYearName,
        Integer totalStudents,
        Integer totalProjects,
        Integer activeProjects,
        Integer completedProjects,
        List<ProjectProgressDto> projectProgress
) {
}
