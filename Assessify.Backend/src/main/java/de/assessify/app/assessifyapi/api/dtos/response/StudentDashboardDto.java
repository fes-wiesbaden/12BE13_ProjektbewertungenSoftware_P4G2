package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;

public record StudentDashboardDto(
        Integer studentId,
        String studentName,
        Integer classId,
        String className,
        String currentAcademicYear,
        Integer totalProjects,
        Integer activeProjects,
        Integer pendingReviews,
        Integer completedReviews,
        List<ProjectResponseDto> myProjects,
        List<GroupResponseDto> myGroups,
        StudentGradeReportDto gradeReport
) {
}
