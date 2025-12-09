package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;

public record TeacherDashboardDto(
        Integer teacherId,
        String teacherName,
        Integer totalClasses,
        Integer totalProjects,
        Integer totalStudents,
        Integer pendingGrades,
        List<ClassResponseDto> myClasses,
        List<ProjectResponseDto> myProjects,
        List<ReviewSummaryDto> pendingReviews
) {
}
