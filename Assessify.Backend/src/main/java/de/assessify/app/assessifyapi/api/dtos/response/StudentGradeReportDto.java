package de.assessify.app.assessifyapi.api.dtos.response;

import java.math.BigDecimal;
import java.util.List;

public record StudentGradeReportDto(
        Integer studentId,
        String studentName,
        String studentEmail,
        Integer classId,
        String className,
        Integer academicYearId,
        String academicYearName,
        List<LernfeldGradeDto> lernfeldGrades,
        BigDecimal overallAverage,
        BigDecimal weightedAverage
) {
}
