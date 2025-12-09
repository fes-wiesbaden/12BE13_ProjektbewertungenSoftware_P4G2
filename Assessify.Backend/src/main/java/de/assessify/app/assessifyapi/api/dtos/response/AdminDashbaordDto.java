package de.assessify.app.assessifyapi.api.dtos.response;

import java.util.List;

public record AdminDashbaordDto(
        Integer totalUsers,
        Integer totalTeachers,
        Integer totalStudents,
        Integer totalCourses,
        Integer totalClasses,
        Integer activeClasses,
        Integer totalProjects,
        List<ClassResponseDto> recentClasses
) {
}
