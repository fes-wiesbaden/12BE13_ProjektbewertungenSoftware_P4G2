package de.assessify.app.assessifyapi.api.dtos.response;

import de.assessify.app.assessifyapi.api.dtos.response.UserResponseDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ClassResponseDto (
        Integer id,
        Integer courseId,
        String courseName,
        String courseCode,
        Integer cohortYear,
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        Integer currentAcademicYear,
        String currentAcademicYearName,
        String status,
        LocalDateTime creationDate,
        Integer totalStudents,
        Integer totalTeachers,
        List<UserResponseDto> teachers,
        List<AcademicYearResponseDto> academicYears
) {}
